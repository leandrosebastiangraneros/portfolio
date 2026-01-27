import asyncio
import websockets
import json
import time
import os

# AWS US East (N. Virginia) - Closer to Render's default region for better demo 'ping'
TARGET_HOST = "dynamodb.us-east-1.amazonaws.com"
TARGET_PORT = 443
PORT = 8765

async def tcp_ping(host, port):
    """Measures TCP handshake latency to the target."""
    start_time = time.time()
    try:
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port), timeout=2
        )
        writer.close()
        await writer.wait_closed()
        end_time = time.time()
        return (end_time - start_time) * 1000  # Convert to ms
    except (OSError, asyncio.TimeoutError):
        return None

async def measure_latency(websocket):
    print(f"Client connected from {websocket.remote_address}")
    try:
        while True:
            latency_ms = await tcp_ping(TARGET_HOST, TARGET_PORT)
            
            if latency_ms is None:
                # Timeout or error
                data = {
                    "ping": "N/A",
                    "status": "offline",
                    "message": "Timeout/Paquete perdido"
                }
            else:
                # Determine status
                if latency_ms < 50:
                    status = "competitive"
                elif latency_ms < 100:
                    status = "good"
                else:
                    status = "lag"
                
                data = {
                    "ping": int(latency_ms),
                    "status": status
                }
            
            # Send JSON to client
            await websocket.send(json.dumps(data))
            
            # Wait 1 second before next ping
            await asyncio.sleep(1)
            
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    except Exception as e:
        print(f"Error in measure_latency: {e}")

async def main():
    port = int(os.environ.get("PORT", 8765))
    print(f"Starting Fortnite Latency Monitor Server on port {port}...")
    print(f"Targeting: {TARGET_HOST}:{TARGET_PORT} (TCP Mode)")
    # Bind to 0.0.0.0 for external access (required by Render)
    async with websockets.serve(measure_latency, "0.0.0.0", port):
        await asyncio.Future() # Run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Server stopped by user.")


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import GlassContainer from '../common/GlassContainer';

const TransactionsModule = ({ transactions }) => {

    // PDF Generator - PROFESSIONAL RECEIPT VERSION
    const handleDownloadReceipt = async (data) => {
        if (!data) return;
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;

            // --- HEADER ---
            // Company Name
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.text("NEXUS HARDWARE", pageWidth / 2, 20, { align: 'center' });

            // Subheader/Contact Info
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("Av. Tecnológica 2077, Buenos Aires, Argentina", pageWidth / 2, 26, { align: 'center' });
            doc.text("Web: www.nexushardware.com | Tel: +54 11 5555-5555", pageWidth / 2, 31, { align: 'center' });
            doc.text("IVA Responsable Inscripto", pageWidth / 2, 36, { align: 'center' });

            // Divider Line
            doc.setDrawColor(200);
            doc.line(10, 40, pageWidth - 10, 40);

            // --- INFO BLOCK ---
            doc.setTextColor(0);
            doc.setFontSize(10);

            // Left Side: Invoice Info
            doc.setFont("helvetica", "bold");
            doc.text("INVOICE / FACTURA", 14, 50);
            doc.setFont("helvetica", "normal");
            doc.text(`ID: #${data.transaction_id}`, 14, 56);
            doc.text(`Date: ${new Date(data.timestamp).toLocaleString()}`, 14, 62);

            // Right Side: Customer Info (Generic)
            doc.text(`Terminal: POS-01`, pageWidth - 60, 56);
            doc.text(`Cashier: ADMIN`, pageWidth - 60, 62);

            // --- ITEMS TABLE ---
            const tableBody = data.products.map(p => [
                p.name,
                "1",
                `$${p.price.toLocaleString('es-AR')}`,
                `$${p.price.toLocaleString('es-AR')}`
            ]);

            autoTable(doc, {
                startY: 70,
                head: [['DESCRIPTION', 'QTY', 'UNIT PRICE', 'AMOUNT']],
                body: tableBody,
                theme: 'plain',
                styles: { fontSize: 9, cellPadding: 3 },
                headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
                columnStyles: {
                    0: { cellWidth: 'auto' }, // Description
                    1: { cellWidth: 20, halign: 'center' }, // Qty
                    2: { cellWidth: 30, halign: 'right' }, // Unit Price
                    3: { cellWidth: 30, halign: 'right' }, // Amount
                },
                didDrawPage: () => {
                    // Footer on every page if needed
                }
            });

            // --- TOTALS SECTION ---
            const finalY = doc.lastAutoTable.finalY + 10;

            // Draw a box for totals
            doc.setDrawColor(0);
            doc.setLineWidth(0.1);
            // doc.rect(pageWidth - 80, finalY - 5, 70, 25);

            doc.setFontSize(10);
            doc.text("Subtotal:", pageWidth - 75, finalY);
            doc.text(`$${data.total_value.toLocaleString('es-AR')}`, pageWidth - 15, finalY, { align: 'right' });

            doc.text("Tax (21%):", pageWidth - 75, finalY + 6);
            doc.text("$0.00", pageWidth - 15, finalY + 6, { align: 'right' }); // Assuming included or 0 for demo

            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("TOTAL:", pageWidth - 75, finalY + 14);
            doc.text(`$${data.total_value.toLocaleString('es-AR')}`, pageWidth - 15, finalY + 14, { align: 'right' });

            // --- FOOTER / POLICY ---
            const pageHeight = doc.internal.pageSize.height;

            doc.setFont("courier", "normal"); // Monospaced for barcode feel
            doc.setFontSize(10);
            doc.text(`||||||| |||| || |||||| ||||| |||| || ||| ${data.transaction_id}`, pageWidth / 2, pageHeight - 30, { align: 'center' });

            doc.setFont("helvetica", "italic");
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text("Thank you for your purchase!", pageWidth / 2, pageHeight - 20, { align: 'center' });
            doc.text("Returns accepted within 30 days with original packaging.", pageWidth / 2, pageHeight - 15, { align: 'center' });

            doc.save(`Invoice_${data.transaction_id}.pdf`);
        } catch (error) {
            console.error(error);
            alert("Error generating PDF");
        }
    };

    if (!transactions || transactions.length === 0) {
        return <div className="p-8 text-center text-txt-dim">No transactions found.</div>;
    }

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <GlassContainer className="overflow-hidden h-full flex flex-col">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                    <h3 className="font-display font-bold text-lg text-white">TRANSACTION_HISTORY</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-mono text-accent uppercase tracking-wider">Log Active</span>
                    </div>
                </div>

                <div className="overflow-x-auto grow h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-[10px] font-mono uppercase text-txt-secondary tracking-wider sticky top-0 backdrop-blur-md z-10">
                            <tr>
                                <th className="p-4 font-normal bg-black/60">Transaction ID</th>
                                <th className="p-4 font-normal bg-black/60">Date & Time</th>
                                <th className="p-4 font-normal bg-black/60">Details</th>
                                <th className="p-4 font-normal bg-black/60 text-right">Total Amount</th>
                                <th className="p-4 font-normal bg-black/60 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {transactions.map(tx => (
                                <tr key={tx.transaction_id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 font-mono text-accent">#{tx.transaction_id}</td>
                                    <td className="p-4 text-txt-dim text-xs">
                                        {new Date(tx.timestamp).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-white text-xs">
                                        {tx.products.length} items ({tx.products.map(p => p.name).join(', ').slice(0, 30)}...)
                                    </td>
                                    <td className="p-4 text-right font-mono font-bold text-white">
                                        ${tx.total_value.toLocaleString('es-AR')}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDownloadReceipt(tx)}
                                            className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white uppercase tracking-wider border border-white/10 hover:border-accent transition-all"
                                        >
                                            Receipt
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassContainer>
        </div>
    );
};

export default TransactionsModule;

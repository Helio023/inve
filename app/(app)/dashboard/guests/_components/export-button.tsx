'use client';

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

interface GuestData {
  name: string;
  status: string;
  confirmedAdults: number;
  confirmedKids: number;
  phone?: string;
  eventName?: string;
}

export function ExportButton({ guests, eventName = "Lista Geral" }: { guests: any[], eventName?: string }) {

  // --- Lógica Excel (CSV) ---
  const exportToCSV = () => {
    if (guests.length === 0) {
      toast.error("A lista está vazia.");
      return;
    }

    const headers = ["Nome", "Status", "Adultos", "Crianças", "Telefone", "Evento"];
    
    const rows = guests.map(g => [
      `"${g.name}"`, // Aspas para evitar quebra com vírgulas no nome
      translateStatus(g.status),
      g.confirmedAdults,
      g.confirmedKids,
      g.phone || "-",
      `"${g.eventId?.title || eventName}"`
    ]);

    const csvContent = [
      headers.join(","), 
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Cria link falso para download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `convidados_${eventName.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Download do CSV iniciado!");
  };

  // --- Lógica PDF ---
  const exportToPDF = () => {
    if (guests.length === 0) {
      toast.error("A lista está vazia.");
      return;
    }

    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text(`Lista de Presença: ${eventName}`, 14, 22);
    
    // Data de emissão
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-MZ')}`, 14, 30);

    // Resumo
    const total = guests.length;
    const confirmed = guests.filter(g => g.status === 'CONFIRMED').length;
    const totalAdults = guests.reduce((acc, g) => acc + (g.confirmedAdults || 0), 0);
    const totalKids = guests.reduce((acc, g) => acc + (g.confirmedKids || 0), 0);

    doc.text(`Total Convidados: ${total} | Confirmados: ${confirmed}`, 14, 36);
    doc.text(`Pessoas: ${totalAdults} Adultos + ${totalKids} Crianças`, 14, 42);

    // Tabela
    const tableData = guests.map(g => [
      g.name,
      translateStatus(g.status),
      g.status === 'CONFIRMED' ? (g.confirmedAdults + g.confirmedKids).toString() : '-',
      g.phone || '-'
    ]);

    autoTable(doc, {
      head: [['Nome', 'Status', 'Qtd.', 'Telefone']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] }, // Azul (Primary)
      alternateRowStyles: { fillColor: [245, 247, 250] } // Cinza claro
    });

    doc.save(`lista_presenca_${eventName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    toast.success("PDF gerado com sucesso!");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar Lista</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          Baixar PDF (Impressão)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Baixar Excel (CSV)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function translateStatus(status: string) {
  switch (status) {
    case 'CONFIRMED': return 'Confirmado';
    case 'DECLINED': return 'Recusado';
    default: return 'Pendente';
  }
}
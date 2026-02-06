"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  UserCheck,
  Users,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { getAllGuestsForExportAction } from "@/features/guests/actions";

export function ExportButton({
  filters,
  eventName,
}: {
  filters: any;
  eventName: string;
}) {
  const [isExporting, setIsExporting] = useState(false);

  const translateStatus = (s: string) => {
    const map: any = {
      CONFIRMED: "Confirmado",
      DECLINED: "Recusado",
      PENDING: "Pendente",
    };
    return map[s] || "Pendente";
  };

  const fetchDataAndExport = async (
    type: "pdf" | "csv",
    checkedInOnly: boolean = false,
  ) => {
    setIsExporting(true);
    const res = await getAllGuestsForExportAction({
      ...filters,
      checkedInOnly,
    });

    if (res.error || !res.data) {
      toast.error("Erro ao preparar ficheiro.");
      setIsExporting(false);
      return;
    }

    const titleSuffix = checkedInOnly
      ? "Presentes_no_Local"
      : "Confirmados_RSVP";
    if (type === "pdf") generatePDF(res.data, titleSuffix);
    else generateCSV(res.data, titleSuffix);

    setIsExporting(false);
  };

  const generateCSV = (guests: any[], suffix: string) => {
    const headers = [
      "Nº",
      "Nome",
      "Status RSVP",
      "Check-in",
      "Adultos",
      "Crianças",
      "Menu",
    ];
    const rows = guests.map((g, i) => [
      i + 1,
      `"${g.name}"`,
      translateStatus(g.status),
      g.checkedIn ? "Sim" : "Não",
      g.checkedIn ? g.arrivedAdults || 0 : g.confirmedAdults || 0,
      g.checkedIn ? g.arrivedKids || 0 : g.confirmedKids || 0,
      `"${g.menuChoices?.map((m: any) => m.item).join(", ") || "-"}"`,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
    );
    link.setAttribute("download", `${eventName}_${suffix}.csv`);
    link.click();
  };

  const generatePDF = (guests: any[], suffix: string) => {
    const doc = new jsPDF("l", "mm", "a4");
    const isPresentList = suffix.includes("Presentes");

    doc.setFontSize(18);
    doc.text(`Qonvip - ${eventName}`, 14, 15);
    doc.setFontSize(12);
    doc.text(
      isPresentList
        ? "LISTA DE PRESENÇAS (CHECK-IN REALIZADO)"
        : "LISTA DE CONFIRMADOS (RSVP)",
      14,
      22,
    );

    const tableData = guests.map((g, i) => [
      i + 1,
      g.name,
      translateStatus(g.status),
      isPresentList
        ? `${g.arrivedAdults}A + ${g.arrivedKids}C`
        : `${g.confirmedAdults}A + ${g.confirmedKids}C`,
      g.checkedIn ? "SIM" : "NÃO",
      g.menuChoices?.map((m: any) => m.item).join(", ") || "-",
    ]);

    autoTable(doc, {
      head: [["#", "Nome", "Status RSVP", "Pessoas", "Check-in", "Menu"]],
      body: tableData,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 8 },
    });

    doc.save(`${eventName}_${suffix}.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-slate-300 shadow-sm"
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="font-bold text-xs uppercase">Exportar Listas</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel className="text-[10px] uppercase text-slate-400">
          Baseado no RSVP
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => fetchDataAndExport("pdf", false)}
          className="cursor-pointer gap-2"
        >
          <FileText className="w-4 h-4 text-blue-500" /> Lista de Confirmados
          (PDF)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => fetchDataAndExport("csv", false)}
          className="cursor-pointer gap-2"
        >
          <FileSpreadsheet className="w-4 h-4 text-blue-500" /> Lista de
          Confirmados (Excel)
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuLabel className="text-[10px] uppercase text-slate-400">
          Baseado no Check-in (Real)
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => fetchDataAndExport("pdf", true)}
          className="cursor-pointer gap-2 bg-green-50 focus:bg-green-100"
        >
          <UserCheck className="w-4 h-4 text-green-600" /> Lista de Presentes
          (PDF)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => fetchDataAndExport("csv", true)}
          className="cursor-pointer gap-2 bg-green-50 focus:bg-green-100"
        >
          <FileSpreadsheet className="w-4 h-4 text-green-600" /> Lista de
          Presentes (Excel)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

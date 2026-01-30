"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { changePasswordAction } from "@/features/auth/actions/security.action";

export function SecurityForm({ userEmail }: { userEmail: string }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Estados para controlar a visibilidade das senhas
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await changePasswordAction(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Senha alterada com sucesso!");
      formRef.current?.reset();
      // Reseta a visibilidade por segurança
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" /> Segurança da Conta
        </CardTitle>
        <CardDescription>
          Gerencie o acesso à sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Email de Login */}
        <div className="space-y-2">
          <Label>Email de Login</Label>
          <div className="flex gap-2">
             <Input value={userEmail} disabled className="bg-slate-100 text-slate-500" />
             <div className="text-[10px] text-slate-400 self-center w-full">
               Para mudar o email de login, contacte o suporte.
             </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 my-4" />

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
           <h4 className="text-sm font-bold text-slate-900">Alterar Senha</h4>
           
           {/* Senha Atual */}
           <div className="space-y-2">
             <Label htmlFor="current">Senha Atual</Label>
             <div className="relative">
               <Input 
                 id="current" 
                 name="currentPassword" 
                 type={showCurrent ? "text" : "password"} 
                 required 
                 className="pr-10" // Espaço para o ícone
               />
               <Button
                 type="button"
                 variant="ghost"
                 size="icon"
                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600"
                 onClick={() => setShowCurrent(!showCurrent)}
               >
                 {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
               </Button>
             </div>
           </div>

           <div className="grid md:grid-cols-2 gap-4">
             {/* Nova Senha */}
             <div className="space-y-2">
               <Label htmlFor="new">Nova Senha</Label>
               <div className="relative">
                 <Input 
                   id="new" 
                   name="newPassword" 
                   type={showNew ? "text" : "password"} 
                   required 
                   minLength={6} 
                   className="pr-10"
                 />
                 <Button
                   type="button"
                   variant="ghost"
                   size="icon"
                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600"
                   onClick={() => setShowNew(!showNew)}
                 >
                   {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                 </Button>
               </div>
             </div>

             {/* Confirmar Nova Senha */}
             <div className="space-y-2">
               <Label htmlFor="confirm">Confirmar Nova Senha</Label>
               <div className="relative">
                 <Input 
                   id="confirm" 
                   name="confirmPassword" 
                   type={showConfirm ? "text" : "password"} 
                   required 
                   minLength={6} 
                   className="pr-10"
                 />
                 <Button
                   type="button"
                   variant="ghost"
                   size="icon"
                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600"
                   onClick={() => setShowConfirm(!showConfirm)}
                 >
                   {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                 </Button>
               </div>
             </div>
           </div>

           <div className="flex justify-end pt-2">
             <Button type="submit" disabled={loading} className="min-w-[140px] bg-slate-900 hover:bg-slate-800">
               {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
               Atualizar Senha
             </Button>
           </div>
        </form>

      </CardContent>
    </Card>
  );
}
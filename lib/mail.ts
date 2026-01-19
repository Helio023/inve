import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.AUTH_URL;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/reset-password?token=${token}`;

  await resend.emails.send({
    from: 'Invite SaaS <onboarding@resend.dev>', // Em produção, use seu domínio verificado
    to: email,
    subject: 'Redefinir sua senha',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Redefinição de Senha</h2>
        <p>Você solicitou a alteração da sua senha no Invite SaaS.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <a href="${resetLink}" style="background-color: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
          Redefinir Senha
        </a>
        <p style="color: #666; font-size: 12px;">Se você não solicitou isso, ignore este e-mail. O link expira em 1 hora.</p>
      </div>
    `
  });
};
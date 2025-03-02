import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const logoBase64 = await readFile(join(__dirname, "logo.png"), {
  encoding: "base64",
});

export const encodedMessage = ({
  type = "Notificação",
  from,
  to,
  subject,
  body,
}) => {
  const rawEmail = `From: <${from}>
To: <${to}>
Subject: ${type + "-" + subject}
MIME-Version: 1.0
Content-Type: text/html; charset=utf-8
Content-Transfer-Encoding: 8bit

 <!DOCTYPE html>
    <html lang="pt-BR">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style type="text/css">
            body {
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
    
            .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            .email-logo img {
                max-width: 200px;
                display: block;
                margin: 0 auto;
                margin-bottom: 20px;
            }
    
            .email-header {
                text-align: center;
                margin-bottom: 20px;
            }
    
            .email-header h1 {
                color: #5f6061;
            }
    
            .email-body {
                margin-bottom: 20px;
                font-size: 16px;
            }
    
            .email-footer {
                font-size: 12px;
                text-align: center;
                color: #777;
            }
        </style>
    </head>
    
    <body>
        <div class="email-container">
            <div class="email-logo">
                <img src="data:image/png;base64,${logoBase64}" style="vertical-align:middle; height:45px" alt="Logo" />
            </div>
            <div class="email-header">
                <h1>${subject}</h1>
            </div>
            <div class="email-body">
                
                <p>${body}</p>
                
            </div>
            <div class="email-footer">
                <p>Atenciosamente,</p>
                <p>Equipe de Suporte- Abdul Kevin Alexis</p>
            </div>
        </div>
    </body>
    
    </html>
    
   `;

  const base64Encoded = Buffer.from(rawEmail)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return base64Encoded;
};

# Descarte Certo Posse

Site com mapa dos pontos de coleta de lixo eletrônico em Posse - GO.

## Como rodar

Requer Node.js 22 ou superior (usa o módulo `node:sqlite`, nativo do Node).

```bash
npm install
npm start
```

O site sobe em `http://localhost:3000`.

## Área do administrador

Para cadastrar novos pontos de coleta, crie uma conta em `/cadastro`. É exigido
um código de convite, definido pela variável de ambiente `ADMIN_INVITE_CODE`
(padrão: `posse2026` — troque isso antes de colocar o site no ar). Depois de
logado, a página `/admin` permite cadastrar e remover pontos.

## Variáveis de ambiente

| Variável            | Para que serve                                   | Padrão                     |
|---------------------|---------------------------------------------------|----------------------------|
| `PORT`              | Porta em que o servidor sobe                       | `3000`                     |
| `SESSION_SECRET`    | Chave usada para assinar o cookie de sessão        | valor de exemplo (troque!) |
| `ADMIN_INVITE_CODE` | Código exigido para criar conta de administrador   | `posse2026`                |

## Banco de dados

Os dados ficam em `data/site.sqlite` (criado automaticamente na primeira
execução), com as tabelas `usuarios` (contas de administrador) e `pontos`
(pontos de coleta exibidos no mapa).

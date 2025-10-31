# concurso

## Sobre

Pequeno site para agrupar legislações usadas em um concurso. Contém uma lista de leis e um visualizador embutido de PDFs (usando PDF.js via CDN).

## Como usar

- Abra `index.html` em um navegador. Recomendo servir os arquivos por um servidor HTTP local (evita problemas de CORS com PDF.js).

Exemplo (Python 3) para servir o diretório atual na porta 8000:

```bash
python3 -m http.server 8000
# e depois abra http://localhost:8000 no navegador
```

## Dependências

- O visualizador usa PDF.js via CDN (unpkg). Se precisar funcionar offline, copie `pdf.min.js` e `pdf.worker.min.js` para o projeto e ajuste os caminhos em `index.html`/`viewer.js`.

## O que foi adicionado

- `viewer.js` — visualizador mínimo usando PDF.js: navegação por página, zoom, baixar e abrir em nova aba.
- Atualizações em `index.html` e `style.css` para layout com sidebar, barra de busca e toolbar do visualizador.

## Arquivos não disponíveis no repositório

Durante a verificação, os seguintes itens foram identificados como não presentes no repositório (estavam marcados no site como "Não foi possível baixar"):

- Código de Trânsito Brasileiro (não fornecido)
- Lei nº 11.343/2006 (não fornecida)
- Apostila “Direção Defensiva e Prevenção de Sinistros” (não fornecida)

Se você fornecer esses arquivos (PDFs ou HTML), eu posso adicioná-los ao diretório `legislacoes/` e o visualizador passa a abri-los automaticamente.

## Próximos passos sugeridos

- (opcional) Incluir cópias locais do PDF.js para uso offline.
- (opcional) Implementar miniaturas e pré-carregamento para melhorar UX.

# Guia de Uso - Material Icons

## Instalação Concluída ✅

O Angular Material Icons foi instalado e configurado com sucesso no projeto!

## Como Usar

### 1. Ícones Básicos
Para usar um ícone Material, simplesmente adicione um elemento `<span>` com a classe `material-icons`:

```html
<span class="material-icons">nome_do_icone</span>
```

### 2. Exemplos Implementados

#### Botão de Adicionar
```html
<button class="btn-primary">
  <span class="material-icons mr-2">add</span>
  Add Product
</button>
```

#### Botão de Editar
```html
<button class="p-2 text-gray-400 hover:text-primary-600">
  <span class="material-icons text-lg">edit</span>
</button>
```

#### Botão de Deletar
```html
<button class="p-2 text-gray-400 hover:text-red-600">
  <span class="material-icons text-lg">delete</span>
</button>
```

#### Botão de Refresh
```html
<button class="p-2 text-gray-600 hover:text-gray-900">
  <span class="material-icons">refresh</span>
</button>
```

### 3. Ícones Mais Comuns

- `add` - Adicionar
- `edit` - Editar
- `delete` - Deletar
- `refresh` - Atualizar
- `search` - Pesquisar
- `filter_list` - Filtrar
- `close` - Fechar
- `check` - Confirmar
- `cancel` - Cancelar
- `save` - Salvar
- `home` - Home
- `menu` - Menu
- `settings` - Configurações
- `person` - Usuário
- `shopping_cart` - Carrinho
- `favorite` - Favorito
- `star` - Estrela

### 4. Personalização de Tamanho

Use classes do Tailwind para controlar o tamanho:

```html
<span class="material-icons text-sm">add</span>    <!-- Pequeno -->
<span class="material-icons text-lg">add</span>    <!-- Médio -->
<span class="material-icons text-xl">add</span>    <!-- Grande -->
<span class="material-icons text-2xl">add</span>   <!-- Extra Grande -->
```

### 5. Personalização de Cor

Use classes do Tailwind para controlar a cor:

```html
<span class="material-icons text-primary-600">add</span>
<span class="material-icons text-red-500">delete</span>
<span class="material-icons text-gray-400">edit</span>
```

## Configuração Técnica

- **Fonte**: Google Fonts Material Icons
- **CDN**: `https://fonts.googleapis.com/icon?family=Material+Icons`
- **Arquivo**: `src/index.html`
- **Versão Angular Material**: 19.x (compatível com Angular 19)

## Próximos Passos

1. Explore mais ícones em: https://fonts.google.com/icons
2. Considere usar Angular Material Components para uma experiência mais completa
3. Implemente ícones animados usando CSS transitions

---

**Nota**: Todos os ícones SVG existentes foram substituídos por Material Icons nos componentes principais para demonstração.

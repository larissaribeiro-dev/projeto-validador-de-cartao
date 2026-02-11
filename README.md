# 💳 Validador de Cartão de Crédito

![Status do Projeto](https://img.shields.io/badge/Status-Finalizado-success?style=for-the-badge)
![Tecnologias](https://img.shields.io/badge/Tech-HTML--CSS--JS-blueviolet?style=for-the-badge)

Um projeto moderno e educativo que utiliza **Expressões Regulares (Regex)** de alta precisão e o **Algoritmo de Luhn** para validar números de cartão de crédito. A aplicação foca na rapidez e segurança, operando 100% no lado do usuário.



## 🚀 Funcionalidades

* 🔍 **Detecção de Bandeiras**: Identifica Visa, Mastercard, Amex, Elo, Hipercard, Diners, Discover, JCB e muito mais.
* 🧮 **Check de Integridade**: Implementação robusta do Algoritmo de Luhn (Módulo 10).
* 🌙 **Personalização**: Suporte a temas claro e escuro que respeitam a preferência do usuário.
* 📱 **Design Responsivo**: Interface que se adapta perfeitamente a desktops, tablets e smartphones.
* 🔒 **Privacidade Total**: Nenhum dado é enviado para servidores; tudo acontece localmente.

---

## 🧮 Detalhes Técnicos

### O Algoritmo de Luhn
O coração da validação matemática. Ele funciona através de uma soma de verificação para evitar erros de digitação acidentais.



**Passo a passo implementado:**
1.  Da direita para a esquerda, dobra-se o valor de cada segundo dígito.
2.  Se o resultado for maior que 9, somam-se os algarismos (ex: 16 vira 1+6 = 7).
3.  Soma-se o total de todos os dígitos resultantes.
4.  O número é considerado válido se o total for um múltiplo de 10.

### Bandeiras Suportadas (Regex)
O motor lógico do projeto utiliza um objeto de padrões altamente detalhado para identificar os IINs (Issuer Identification Numbers):

* **Visa**: Prefixo 4 (inclui Electron com 4026, 4405, etc).
* **Elo**: Identifica diversos BINs específicos (4011, 5067, 6363, etc).
* **Mastercard**: Suporta a série clássica (51-55) e a nova série (2221-2720).
* **Hipercard**: Detecção precisa do padrão exclusivo `606282`.
* **Amex**: Reconhecimento do padrão de 15 dígitos iniciado por 34 ou 37.
* **Diners Club**: Prefixos 300-305, 36 ou 38.

---

## 🎨 Interface e UX

* **Botão de Tema**: Um toggle flutuante que altera as variáveis CSS do projeto e possui uma animação de salto suave (bounce) ao passar o mouse.
* **Feedback Visual**: O campo de input exibe o ícone da bandeira em tempo real e muda de cor para indicar erros.
* **Máscara Automática**: O input aplica espaços automaticamente para melhorar a legibilidade do número.

---

## 🔧 Estrutura do Repositório

```bash
projeto-validador-cartao/
├── index.html   # Estrutura otimizada e semântica
├── script.js    # Lógica de Regex, Luhn e controle de tema
├── style.css    # Variáveis CSS (Themes) e animações de Keyframes
└── README.md    # Documentação do projeto
```

## 📖 Como Executar Localmente

1. Clone ou baixe o repositório / [clique aqui para entrar direto e testar o validador](https://validador-de-cartao.web.app/)
2. Navegue até a pasta `projeto-validador-cartao`
3. Abra `index.html` com um navegador moderno
4. Comece a validar cartões!

## 🤝 Contribuindo

Este é um projeto educacional. Sugestões e melhorias são bem-vindas!

## 📝 Licença

Projeto desenvolvido para fins educacionais na plataforma DIO (Digital Innovation One).

## 👨‍💻 Autor

Desenvolvido por [Larissa Ribeiro](https://github.com/larissaribeiro-dev) como parte da trilha de educação em programação - Projeto DIO
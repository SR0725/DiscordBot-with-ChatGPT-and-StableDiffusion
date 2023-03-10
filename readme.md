# Discord Chatbot

這是一個整合 ChatGPT API 和 Stable Diffusion 繪圖人工智慧的 Discord 機器人。使用者可以透過直接 tag 機器人並加上想說的話來跟其對話。此外，使用者也可以輸入 '/draw prompt:描述詞' 來繪製圖片，值得一提的是，系統使用 ChatGPT 對描述詞做轉換，其中所有描述詞可以非常白話或甚至是中文。

## 安裝

首先，您需要複製存儲庫。請運行以下命令以複製存儲庫：

```sh
git clone https://github.com/SR0725/DiscordBot-with-ChatGPT-and-StableDiffusion
```

接下來，您需要安裝此聊天機器人所需的所有依賴項。請運行以下命令來安裝依賴項：

```sh
yarn
```

最後，您需要啟動機器人。請運行以下命令：

```sh
yarn start
```

## 使用

在啟動聊天機器人後，使用者可以直接 tag 機器人並加上想說的話來跟其對話。

使用者也可以輸入 `/gpt-draw prompt:描述詞` 來繪製圖片，其中描述詞可以非常白話或甚至是中文，這個機器人會自動使用 ChatGPT 對描述詞進行轉換並且使用 Stable Diffusion 繪圖人工智慧繪製出對應的圖片。以下是使用範例：

使用者: @Bot 你好嗎？\
機器人: 我很好，你呢？

使用者: /gpt-draw prompt:一個可愛的貓咪\
機器人: 一個可愛的貓咪圖片

另外也能使用 `/draw prompt:描述詞` 直接指定 Stable Diffusion 進行繪製，這個指令也提供如 `width`、`height`、`steps` 等參數進行深度調整。

## 文件架構

```text
/src
├── index.ts
├── chatGPT.ts
├── stableDiffusionAI.ts
└── utils.ts
/.env.local
```

- /src/index.ts - 根目錄，在此處引入所有服務並注入進 Bot 裡頭。

- /.env.local - 配置文件，請記得參考 /.env.example 的格式，並加上自己的 OpenAI API 以及 Discord Bot Token 來新增此文件。

## 貢獻

如有任何建議或錯誤，請開啟一個 issue。如果您想幫助改進這個存儲庫，請 fork 此存儲庫，進行更改，並提交 pull request。

## 授權

此存儲庫基於 MIT 授權。
另外本文件由 ChatGPT 撰寫

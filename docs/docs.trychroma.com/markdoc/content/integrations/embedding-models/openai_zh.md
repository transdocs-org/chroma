```typescript
const openai_ef = new OpenAIEmbeddingFunction({
  openAIApiKey: "YOUR_API_KEY",
  model: "text-embedding-3-small"
});
```

To use the OpenAI embedding models on other platforms such as Azure, you can use the `azureEndpoint`, `apiVersion`, and `deployment` parameters:
```typescript
const openai_ef = new OpenAIEmbeddingFunction({
  openAIApiKey: "YOUR_API_KEY",
  azureEndpoint: "YOUR_AZURE_ENDPOINT",
  apiVersion: "YOUR_API_VERSION",
  deployment: "YOUR_DEPLOYMENT_NAME",
  model: "text-embedding-3-small"
});
```

{% /Tab %}

{% /Tabs %}

```javascript
const embeddingFunction = new OpenAIEmbeddingFunction({
    openai_api_key: "apiKey",
    openai_model: "text-embedding-3-small"
});

// 直接使用
const embeddings = embeddingFunction.generate(["document1", "document2"]);

// 传递文档以进行 .add 和 .query 操作
let collection = await client.createCollection({
    name: "name",
    embeddingFunction: embeddingFunction
});
collection = await client.getCollection({
    name: "name",
    embeddingFunction: embeddingFunction
});
```

```

{% /Tab %}

{% /Tabs %}
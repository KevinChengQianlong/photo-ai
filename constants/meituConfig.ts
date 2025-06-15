import Constants from 'expo-constants';

interface MeituConfig {
  MEITU_API_KEY: "216c6574a34148cabba7b4a6c0eb3d65";
  MEITU_SECRET_KEY: "460d02e917e04e26846b8ab3846272aa";
}

const meituConfig: MeituConfig = {
  MEITU_API_KEY: Constants.expoConfig?.extra?.MEITU_API_KEY || '',
  MEITU_SECRET_KEY: Constants.expoConfig?.extra?.MEITU_SECRET_KEY || '',
};

export default meituConfig;

/*
重要提示：
1. 请在您的项目根目录的 app.json 文件中添加或修改 'extra' 字段，来配置您的美图 API Key 和 Secret Key：

   ```json
   {
     "expo": {
       "extra": {
         "MEITU_API_KEY": "YOUR_MEITU_API_KEY",
         "MEITU_SECRET_KEY": "YOUR_MEITU_SECRET_KEY"
       }
     }
   }
   ```

2. 替换 "YOUR_MEITU_API_KEY" 和 "YOUR_MEITU_SECRET_KEY" 为您从美图开放平台获取的真实密钥。
3. 为了生产环境的安全性，强烈建议您通过环境变量来管理这些密钥，例如在构建过程中注入，而不是直接提交到版本控制中。
   例如，在构建命令前添加环境变量：`EXPO_PUBLIC_MEITU_API_KEY=your_key EXPO_PUBLIC_MEITU_SECRET_KEY=your_secret expo start`
   并在 app.json 中使用：`"MEITU_API_KEY": process.env.EXPO_PUBLIC_MEITU_API_KEY`
*/ 
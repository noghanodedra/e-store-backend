import App from './server';
import envConfig from './src/configs';

const PORT = envConfig.port || 4000;
const appInstance = new App();
appInstance.dbSetup().then(() => {
  appInstance.app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
});

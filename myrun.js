// استيراد السيرفر المترجم
import * as serverModule from './dist/server.js';

// التحقق من وجود التصدير الصحيح
const app = serverModule.default || serverModule.app || serverModule;

export default app;

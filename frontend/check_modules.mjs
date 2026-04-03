const urls = [
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/pages/RegisterPage.tsx',
  '/src/components/PatientRegistration/RegistrationForm.tsx',
  '/src/hooks/useWebSocket.ts',
  '/src/hooks/useVoiceRecognition.ts',
];

async function check() {
  for (const url of urls) {
    try {
      const res = await fetch(`http://localhost:3000${url}`);
      const text = await res.text();
      if (res.status !== 200) {
        console.log(`❌ ${url} — HTTP ${res.status}`);
        console.log(text.substring(0, 500));
      } else if (text.includes('__vite_error')) {
        console.log(`❌ ${url} — Vite transform error`);
        // Find the error part
        const idx = text.indexOf('__vite_error');
        console.log(text.substring(Math.max(0, idx - 200), idx + 500));
      } else {
        console.log(`✅ ${url} — OK (${text.length} bytes)`);
      }
    } catch (e) {
      console.log(`❌ ${url} — ${e.message}`);
    }
  }
}
check();

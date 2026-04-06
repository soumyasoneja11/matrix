export const getTriageResult = async (text: string): Promise<string> => {
  const res = await fetch("http://localhost:8080/api/patients/triage-ai", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain"
    },
    body: text
  });

  return await res.text();
};
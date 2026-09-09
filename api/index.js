export default {
  async fetch(request, env) {
    // CORS Başlıqları (Frontend-in xətasız müraciət edə bilməsi üçün)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8"
    };

    // Preflight (OPTIONS) sorğularını cavablandırırıq
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    try {
      // ----------------------------------------------------
      // 1. GET /api/data -> KV-dən oxuyur
      // ----------------------------------------------------
      if (url.pathname === "/api/data" && request.method === "GET") {
        const rawData = await env.MENU_KV.get("menu_data");

        if (!rawData) {
          return new Response(
            JSON.stringify({ message: "JSON verisində heç bir data tapılmadı." }),
            { status: 404, headers: corsHeaders }
          );
        }

        return new Response(rawData, { status: 200, headers: corsHeaders });
      }

      // ----------------------------------------------------
      // 2. POST /api/add-data -> KV-yə yazır (Köhnəni silib yenisini qeyd edir)
      // ----------------------------------------------------
      if (url.pathname === "/api/add-data" && request.method === "POST") {
        let incomingData;
        
        try {
          incomingData = await request.json();
        } catch (e) {
          return new Response(
            JSON.stringify({ error: "Keçərsiz JSON məlumatı." }),
            { status: 400, headers: corsHeaders }
          );
        }

        // Datanın boş olub-olmadığını yoxlayırıq
        if (
          !incomingData ||
          (Array.isArray(incomingData) && incomingData.length === 0) ||
          Object.keys(incomingData).length === 0
        ) {
          return new Response(
            JSON.stringify({ error: "Göndərilən JSON məlumatı boşdur." }),
            { status: 400, headers: corsHeaders }
          );
        }

        // Əgər obyekt gəlibsə massivə (array) çeviririk
        const dataToInsert = Array.isArray(incomingData) ? incomingData : [incomingData];

        // Cloudflare KV-yə yazırıq ("menu_data" key-i avtomatik yenilənir)
        await env.MENU_KV.put("menu_data", JSON.stringify(dataToInsert));

        // Yenilənmiş datanı KV-dən oxuyub geriyə qaytarırıq
        const updatedData = await env.MENU_KV.get("menu_data");

        return new Response(updatedData, { status: 200, headers: corsHeaders });
      }

      // Uyğun endpoint tapılmadıqda
      return new Response(
        JSON.stringify({ error: "Endpoint tapılmadı." }),
        { status: 404, headers: corsHeaders }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Server xətası baş verdi: " + error.message }),
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
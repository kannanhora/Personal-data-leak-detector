document.getElementById("checkLeakBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    chrome.storage.local.get("currentSite", async (data) => {
        const site = data.currentSite || "this site";

        const requestBody = {
            email: email || null,
            phone: phone || null,
            site: site
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            // Colors for dark mode risk level
            let riskColor = "#ffffff";
            if (result.risk === "High") riskColor = "#ff5252";
            else if (result.risk === "Medium") riskColor = "#ffb74d";
            else if (result.risk === "Low") riskColor = "#4caf50";

            // Human-readable email report
            let emailReport = result.breaches.length > 0
                ? `<ul style="padding-left:15px;">${result.breaches.map(b => `<li>Email leaked on <strong>${b.Name}</strong>: ${b.Description}</li>`).join("")}</ul>
                   <p style="padding-left:15px; color:#ffb74d;">⚠️ Consider changing your passwords for these sites.</p>`
                : "No email leaks found for this site.";

            // Human-readable detected entities
            let entitiesReport = result.nlp_entities.length > 0
                ? `<ul style="padding-left:15px;">${result.nlp_entities.map(e => {
                      if (e.label === "CARDINAL") return `<li>Detected phone number: ${e.entity}</li>`;
                      else if (e.label === "EMAIL") return `<li>Detected email: ${e.entity}</li>`;
                      else return `<li>Detected personal info: ${e.entity}</li>`;
                  }).join("")}</ul>`
                : "No other personal information detected.";

            // Render organized report
            document.getElementById("result").innerHTML = `
                <div style="padding:10px; border-radius:8px; background-color:#1e1e1e;">
                    <h3 style="margin-top:0; color:#ffffff;">🔒 Personal Data Leak Report for ${site}</h3>
                    
                    <section style="margin-bottom:10px;">
                        <h4 style="margin:5px 0; color:#90caf9;">📧 Email Status</h4>
                        <p style="margin:0;">${emailReport}</p>
                    </section>

                    <section style="margin-bottom:10px;">
                        <h4 style="margin:5px 0; color:#90caf9;">🧾 Other Personal Information Detected</h4>
                        <p style="margin:0;">${entitiesReport}</p>
                    </section>

                    <section style="margin-bottom:0;">
                        <h4 style="margin:5px 0; color:#90caf9;">⚠️ Overall Risk Level</h4>
                        <p style="margin:0; font-weight:bold; color:${riskColor}; font-size:16px;">${result.risk}</p>
                    </section>
                </div>
            `;

        } catch (error) {
            console.error("Error:", error);
            document.getElementById("result").innerHTML = "<p style='color:#ff5252'>Could not connect to backend. Make sure it is running.</p>";
        }
    });
});

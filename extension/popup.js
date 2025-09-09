document.getElementById("checkLeakBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // Get current active tab's URL
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const siteUrl = tab.url || "unknown";

    if (!email && !phone) {
        document.getElementById("result").innerHTML = `
            <p style="color:orange; font-weight:bold;">
                ⚠️ You didn’t enter any personal info, but we’ll still check this site for potential risks.
            </p>
        `;
    }

    const requestBody = {
        email: email || null,
        phone: phone || null,
        site_url: siteUrl
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        // Risk level color mapping
        let riskColor = "white";
        if (result.risk === "High") riskColor = "red";
        else if (result.risk === "Medium") riskColor = "orange";
        else if (result.risk === "Low") riskColor = "green";

        document.getElementById("result").innerHTML = `
            <h3>🔍 Personal Data Leak Report for <br><span style="color:cyan;">${siteUrl}</span></h3>
            <p><strong>Email Status:</strong> ${result.breaches.length > 0 
                ? "⚠️ Your email was found in a known data leak related to this site." 
                : "✅ No email leaks found for this site."}</p>
            <p><strong>Other Personal Information:</strong> ${result.nlp_entities.length > 0 
                ? result.nlp_entities.map(e => `${e.entity} (${e.label})`).join(", ") 
                : "None detected."}</p>
            <p><strong>Overall Risk Level:</strong> 
                <span style="color:${riskColor}; font-weight:bold;">${result.risk}</span>
            </p>
        `;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("result").innerHTML = "<p style='color:red'>❌ Error connecting to backend</p>";
    }
});

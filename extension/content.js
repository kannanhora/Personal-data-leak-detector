const currentSite = window.location.hostname;
chrome.storage.local.set({ currentSite: currentSite });

(async function checkSiteLeaks() {
    const requestBody = {
        email: null,
        phone: null,
        site: currentSite
    };

    try {
        const response = await fetch("http://127.0.0.1:8000/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();

        // If risk is Medium or High, show a styled warning in the popup
        if (result.breaches.length > 0 || result.risk === "High" || result.risk === "Medium") {
            // Create a small styled overlay div for the warning
            const warningDiv = document.createElement("div");
            warningDiv.innerHTML = `
                ⚠️ Warning! Possible data leaks detected on <strong>${currentSite}</strong>.
                <br>Risk Level: <strong style="color:${
                    result.risk === "High" ? "#ff5252" : "#ffb74d"
                }">${result.risk}</strong>
                <br>Click the extension icon for full report.
            `;
            warningDiv.style.position = "fixed";
            warningDiv.style.bottom = "10px";
            warningDiv.style.right = "10px";
            warningDiv.style.backgroundColor = "#1e1e1e";
            warningDiv.style.color = "#e0e0e0";
            warningDiv.style.padding = "12px";
            warningDiv.style.border = "1px solid #333";
            warningDiv.style.borderRadius = "8px";
            warningDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
            warningDiv.style.zIndex = 9999;
            warningDiv.style.fontFamily = "Arial, sans-serif";
            warningDiv.style.fontSize = "14px";

            document.body.appendChild(warningDiv);

            // Remove the warning after 8 seconds
            setTimeout(() => {
                warningDiv.remove();
            }, 8000);
        }

    } catch (error) {
        console.error("Error checking site leaks:", error);
    }
})();

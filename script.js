document.addEventListener("DOMContentLoaded", function () {
    const codeArea = document.getElementById('mermaidCode');
    const chartArea = document.getElementById('mermaidChart');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetZoomBtn = document.getElementById('resetZoom');
    const saveImageBtn = document.getElementById('saveImage');
    const autoSync = document.getElementById('autoSync');
    let scale = 1;

    // Initialize Mermaid once the DOM is fully loaded
    mermaid.initialize({
        startOnLoad: false, // We control when to render explicitly
        theme: 'default',
        securityLevel: 'loose', // Allows inline styles and scripts within SVG
    });

    // Function to render Mermaid diagram safely
    function renderMermaid() {
        const code = codeArea.value.trim();

        // Validate if the code is non-empty and chart area exists
        if (!chartArea || !code) {
            chartArea.innerHTML = '<p style="color: red;">Please enter valid Mermaid code!</p>';
            return;
        }

        // Clear existing content to avoid conflicts
        chartArea.innerHTML = '';

        // Use mermaidAPI.render with a unique ID and explicit handling
        try {
            // Generate a unique ID for each render to avoid conflicts
            const uniqueId = 'mermaid-' + Math.floor(Math.random() * 1000000);
            mermaid.mermaidAPI.render(uniqueId, code, (svgCode) => {
                chartArea.innerHTML = svgCode; // Insert the SVG into the target container
            }, chartArea); // Ensure the container element is provided correctly
        } catch (error) {
            console.error('Error rendering Mermaid diagram:', error);
            chartArea.innerHTML = '<p style="color: red;">Invalid Mermaid syntax or rendering error!</p>';
        }
    }

    // Event listener for code area input to trigger rendering if auto-sync is enabled
    codeArea.addEventListener('input', () => {
        if (autoSync.checked) {
            renderMermaid();
        }
    });

    // Zoom in functionality
    zoomInBtn.addEventListener('click', () => {
        scale += 0.1;
        chartArea.style.transform = `scale(${scale})`;
        chartArea.style.transformOrigin = 'top left'; // Ensures scaling starts from top left
    });

    // Zoom out functionality
    zoomOutBtn.addEventListener('click', () => {
        scale = Math.max(scale - 0.1, 0.5);
        chartArea.style.transform = `scale(${scale})`;
        chartArea.style.transformOrigin = 'top left';
    });

    // Reset zoom functionality
    resetZoomBtn.addEventListener('click', () => {
        scale = 1;
        chartArea.style.transform = `scale(${scale})`;
        chartArea.style.transformOrigin = 'top left';
    });

    // Save as image functionality
    saveImageBtn.addEventListener('click', () => {
        const svg = chartArea.querySelector('svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'mermaid-diagram.svg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            alert('No chart to save!');
        }
    });

    // Initial render if auto-sync is enabled
    if (autoSync.checked) {
        renderMermaid();
    }
});

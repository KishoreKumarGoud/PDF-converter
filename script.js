document.getElementById('convertButton').addEventListener('click', () => {
    const input = document.getElementById('imageInput');
    const files = input.files;

    if (files.length === 0) {
        alert('Please select at least one image.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    let promises = [];
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        promises.push(new Promise((resolve) => {
            reader.onload = function (event) {
                const imgData = event.target.result;
                const imgWidth = 190; // Set desired width
                const imgHeight = (file.type === "image/jpeg" || file.type === "image/png") 
                                  ? (imgWidth * 3 / 4) // Aspect ratio
                                  : imgWidth; // Adjust for other types

                if (i > 0) {
                    pdf.addPage();
                }
                pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
                resolve();
            };
            reader.readAsDataURL(file);
        }));
    }

    Promise.all(promises).then(() => {
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const downloadButton = document.getElementById('downloadButton');
        downloadButton.style.display = 'block'; // Show download button

        // Set up download action
        downloadButton.onclick = () => {
            const link = document.createElement('a');
            link.href = url;
            link.download = 'converted.pdf';
            link.click();
            input.value = ''; // Reset the file input
            downloadButton.style.display = 'none'; // Hide download button after download
        };
    });
});

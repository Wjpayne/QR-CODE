
  (function() {
    // Ensure QRCode is available from CDN
    if (typeof QRCode === 'undefined') {
      console.warn('QRCode library not loaded. Please check the CDN script tag.');
      return;
    }

    // --- DOM References ---
    const form = document.getElementById('qrForm');
    const wholeFoodsIdInput = document.getElementById('wholeFoodsId');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const clearButton = document.getElementById('clearButton');
    const resultsSection = document.getElementById('results');
    const idQrContainer = document.getElementById('idQr');
    const passwordQrContainer = document.getElementById('passwordQr');
    const idValueDisplay = document.getElementById('idValue');
    const passwordValueDisplay = document.getElementById('passwordValue');
    const printAllBtn = document.getElementById('printAll');
    const printCardBtns = document.querySelectorAll('.print-card');

    // --- State ---
    let idQRCodeInstance = null;
    let passwordQRCodeInstance = null;

    // --- Helper: Clear QR containers and instances ---
    function clearQRCodes() {
      // Clear containers
      idQrContainer.innerHTML = '';
      passwordQrContainer.innerHTML = '';
      // Reset instances
      if (idQRCodeInstance) {
        idQRCodeInstance.clear();
        idQRCodeInstance = null;
      }
      if (passwordQRCodeInstance) {
        passwordQRCodeInstance.clear();
        passwordQRCodeInstance = null;
      }
      // Clear displayed values
      idValueDisplay.textContent = '';
      passwordValueDisplay.textContent = '';
      // Hide results section
      resultsSection.classList.add('hidden');
    }

    // --- Generate QR Codes ---
    function generateQRCodes(id, password) {
      // Clear previous QR codes (but keep containers)
      if (idQRCodeInstance) {
        idQRCodeInstance.clear();
        idQRCodeInstance = null;
      }
      if (passwordQRCodeInstance) {
        passwordQRCodeInstance.clear();
        passwordQRCodeInstance = null;
      }
      idQrContainer.innerHTML = '';
      passwordQrContainer.innerHTML = '';

      // Generate ID QR
      if (id && id.trim() !== '') {
        try {
          idQRCodeInstance = new QRCode(idQrContainer, {
            text: id.trim(),
            width: 180,
            height: 180,
            colorDark: '#1e293b',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          });
          idValueDisplay.textContent = id.trim();
        } catch (e) {
          console.warn('Failed to generate ID QR:', e);
          idQrContainer.innerHTML = '<p style="color: #b91c1c;">Error generating QR</p>';
        }
      } else {
        idQrContainer.innerHTML = '<p style="color: #6b7280;">No ID provided</p>';
      }

      // Generate Password QR
      if (password && password.trim() !== '') {
        try {
          passwordQRCodeInstance = new QRCode(passwordQrContainer, {
            text: password.trim(),
            width: 180,
            height: 180,
            colorDark: '#1e293b',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          });
          passwordValueDisplay.textContent = password.trim();
        } catch (e) {
          console.warn('Failed to generate Password QR:', e);
          passwordQrContainer.innerHTML = '<p style="color: #b91c1c;">Error generating QR</p>';
        }
      } else {
        passwordQrContainer.innerHTML = '<p style="color: #6b7280;">No password provided</p>';
      }

      // Show results section
      resultsSection.classList.remove('hidden');
    }

    // --- Form Submit Handler ---
    function handleFormSubmit(event) {
      event.preventDefault();

      const id = wholeFoodsIdInput.value;
      const password = passwordInput.value;

      if (!id || !password) {
        alert('Please enter both Whole Foods ID and Password.');
        return;
      }

      generateQRCodes(id, password);
    }

    // --- Clear Form Handler ---
    function handleClear() {
      wholeFoodsIdInput.value = '';
      passwordInput.value = '';
      clearQRCodes();
      wholeFoodsIdInput.focus();
    }

    // --- Toggle Password Visibility ---
    function togglePasswordVisibility() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePasswordBtn.textContent = type === 'password' ? 'Show' : 'Hide';
    }

    // --- Print a single card by its article id ---
    function printCard(cardElement) {
      if (!cardElement) return;
      // Clone the card to avoid modifying the live DOM
      const cardClone = cardElement.cloneNode(true);
      // Remove any print buttons from the clone
      const printButtons = cardClone.querySelectorAll('.print-card');
      printButtons.forEach(btn => btn.remove());

      // Create a temporary container for printing
      const printWindow = window.open('', '_blank', 'width=600,height=600');
      if (!printWindow) {
        alert('Please allow pop-ups to print.');
        return;
      }

      // Build a minimal HTML document with styles that mimic the card look
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Card</title>
            <style>
              body {
                font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
                background: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                padding: 1rem;
              }
              .card-print {
                max-width: 400px;
                width: 100%;
                background: #ffffff;
                border-radius: 24px;
                padding: 1.5rem 1.5rem 2rem;
                box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.1);
                border: 1px solid #e9edf2;
                font-family: inherit;
              }
              .card-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.25rem;
              }
              .type-label {
                font-size: 0.7rem;
                font-weight: 600;
                letter-spacing: 0.05em;
                color: #6b7280;
                text-transform: uppercase;
              }
              .card-icon {
                font-size: 1.25rem;
                color: #4b5563;
              }
              h3 {
                font-size: 1.2rem;
                font-weight: 600;
                margin: 0.25rem 0 1rem 0;
                color: #0b1b2f;
              }
              .qr-frame {
                display: flex;
                justify-content: center;
                align-items: center;
                background: #ffffff;
                border-radius: 16px;
                padding: 1rem;
                margin: 0.5rem 0 0.75rem 0;
                border: 1px solid #e5e9ef;
                position: relative;
              }
              .qr-frame img, .qr-frame canvas {
                display: block;
                max-width: 180px;
                height: auto;
              }
              .qr-corner-icon {
                position: absolute;
                bottom: 8px;
                right: 12px;
                font-size: 1.1rem;
                color: #9ca3af;
              }
              .encoded-value {
                font-size: 0.9rem;
                text-align: center;
                word-break: break-all;
                background: #f3f6fa;
                padding: 0.5rem;
                border-radius: 12px;
                color: #1f2a41;
                margin: 0.75rem 0 0 0;
                border: 1px solid #e5e9ef;
              }
              .password-value {
                font-family: 'Courier New', monospace;
                letter-spacing: 0.02em;
              }
              .card-footer {
                margin-top: 1rem;
                font-size: 0.65rem;
                color: #9ca3af;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="card-print">
              ${cardClone.innerHTML}
              <div class="card-footer">Generated locally · Team QR Cards</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      // Use setTimeout to ensure content is rendered before printing
      setTimeout(() => {
        printWindow.print();
        // Close the window after print (or user can close manually)
        // We'll let the user close it to avoid losing content if they cancel
      }, 250);
    }

    // --- Print both cards (ID and Password) ---
    function printBothCards() {
      const idCard = document.getElementById('idCard');
      const passwordCard = document.getElementById('passwordCard');
      
      // Clone both cards
      const idClone = idCard.cloneNode(true);
      const passwordClone = passwordCard.cloneNode(true);
      
      // Remove print buttons from clones
      idClone.querySelectorAll('.print-card').forEach(btn => btn.remove());
      passwordClone.querySelectorAll('.print-card').forEach(btn => btn.remove());

      // Create a print window
      const printWindow = window.open('', '_blank', 'width=700,height=800');
      if (!printWindow) {
        alert('Please allow pop-ups to print both cards.');
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Both QR Cards</title>
            <style>
              body {
                font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
                background: #f8fafc;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 2rem 1rem;
                margin: 0;
              }
              .cards-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                max-width: 900px;
                width: 100%;
              }
              .card-print {
                background: #ffffff;
                border-radius: 24px;
                padding: 1.5rem 1.5rem 2rem;
                box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.08);
                border: 1px solid #e9edf2;
                font-family: inherit;
              }
              .card-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.25rem;
              }
              .type-label {
                font-size: 0.7rem;
                font-weight: 600;
                letter-spacing: 0.05em;
                color: #6b7280;
                text-transform: uppercase;
              }
              .card-icon {
                font-size: 1.25rem;
                color: #4b5563;
              }
              h3 {
                font-size: 1.2rem;
                font-weight: 600;
                margin: 0.25rem 0 1rem 0;
                color: #0b1b2f;
              }
              .qr-frame {
                display: flex;
                justify-content: center;
                align-items: center;
                background: #ffffff;
                border-radius: 16px;
                padding: 1rem;
                margin: 0.5rem 0 0.75rem 0;
                border: 1px solid #e5e9ef;
                position: relative;
              }
              .qr-frame img, .qr-frame canvas {
                display: block;
                max-width: 180px;
                height: auto;
              }
              .qr-corner-icon {
                position: absolute;
                bottom: 8px;
                right: 12px;
                font-size: 1.1rem;
                color: #9ca3af;
              }
              .encoded-value {
                font-size: 0.9rem;
                text-align: center;
                word-break: break-all;
                background: #f3f6fa;
                padding: 0.5rem;
                border-radius: 12px;
                color: #1f2a41;
                margin: 0.75rem 0 0 0;
                border: 1px solid #e5e9ef;
              }
              .password-value {
                font-family: 'Courier New', monospace;
                letter-spacing: 0.02em;
              }
              .footer-print {
                margin-top: 2rem;
                font-size: 0.7rem;
                color: #9ca3af;
                text-align: center;
              }
              @media print {
                body { background: white; padding: 1rem; }
                .cards-grid { gap: 1.5rem; }
                .card-print { box-shadow: none; border-color: #d1d9e6; }
              }
            </style>
          </head>
          <body>
            <div class="cards-grid">
              <div class="card-print">${idClone.innerHTML}</div>
              <div class="card-print">${passwordClone.innerHTML}</div>
            </div>
            <div class="footer-print">Generated locally · Team QR Cards</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    }

    // --- Event Listeners ---
    form.addEventListener('submit', handleFormSubmit);

    clearButton.addEventListener('click', handleClear);

    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

    // Print individual cards
    printCardBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        const cardId = this.getAttribute('data-card');
        const cardElement = document.getElementById(cardId);
        if (cardElement) {
          // Ensure the card is visible (if results hidden, show them)
          if (resultsSection.classList.contains('hidden')) {
            alert('Please generate QR codes first.');
            return;
          }
          printCard(cardElement);
        } else {
          console.warn('Card element not found:', cardId);
        }
      });
    });

    // Print both cards
    printAllBtn.addEventListener('click', function() {
      if (resultsSection.classList.contains('hidden')) {
        alert('Please generate QR codes first.');
        return;
      }
      // Check if both QR containers have content
      const idContent = idQrContainer.innerHTML.trim();
      const pwdContent = passwordQrContainer.innerHTML.trim();
      if (!idContent || !pwdContent || idContent.includes('No ID') || pwdContent.includes('No password')) {
        alert('Both ID and Password QR codes must be generated before printing both.');
        return;
      }
      printBothCards();
    });

    // Optional: Clear results if user clicks outside? Not needed.

    // --- Initial state: ensure results hidden ---
    resultsSection.classList.add('hidden');

    // --- Handle edge case: if password field has value, toggle button text ---
    // Not needed initially.

    console.log('Team QR Cards script initialized.');
  })();

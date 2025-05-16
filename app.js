:root {
    --primary - color: #00a6d3;
    --primary - dark: #007896;
    --primary - light: #4fd0f7;
    --secondary - color: #e95a0c;
    --secondary - dark: #c13800;
    --secondary - light: #ff8746;
    --dark - color: #2c3e50;
    --light - color: #ecf0f1;
    --success - color: #2ecc71;
    --warning - color: #f39c12;
    --danger - color: #e74c3c;
    --info - color: #3498db;
    --text - dark: #2c3e50;
    --text - light: #f5f5f5;
    --gray - 100: #f8f9fa;
    --gray - 200: #e9ecef;
    --gray - 300: #dee2e6;
    --gray - 400: #ced4da;
    --gray - 500: #adb5bd;
    --gray - 600: #6c757d;
    --gray - 700: #495057;
    --gray - 800: #343a40;
    --gray - 900: #212529;
    --shadow - sm: 0 1px 3px rgba(0, 0, 0, 0.12);
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow - lg: 0 10px 15px - 3px rgba(0, 0, 0, 0.1);
    --border - radius - sm: 4px;
    --border - radius: 8px;
    --border - radius - lg: 12px;
    --transition - speed: 0.3s;
    --transition - bounce: cubic - bezier(0.68, -0.55, 0.27, 1.55);
}

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
    box- sizing: border - box;
margin: 0;
padding: 0;
}

body {
    font - family: 'Poppins', sans - serif;
    line - height: 1.6;
    transition: background - color var(--transition - speed), color var(--transition - speed);
    overflow: hidden;
}

body.light - mode {
    background - color: var(--light - color);
    color: var(--text - dark);
}

body.dark - mode {
    background - color: #121212;
    color: var(--text - light);
}

/* Loading Screen */
#loading - screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100 %;
    height: 100 %;
    background - color: var(--primary - color);
    display: flex;
    justify - content: center;
    align - items: center;
    z - index: 9999;
    transition: opacity 0.5s ease - out, visibility 0.5s ease - out;
}

.loader - container {
    text - align: center;
    color: white;
}

.logo - loader {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 0 auto 20px;
}

#logo - loader {
    width: 100 %;
    height: 100 %;
    object - fit: contain;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0 % {
        transform: scale(1);
    }

    50 % {
        transform: scale(1.05);
    }

    100 % {
        transform: scale(1);
    }
}

.loading - spinner {
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 3px solid transparent;
    border - top - color: white;
    border - radius: 50 %;
    animation: spin 1s linear infinite;
}

    .loading - spinner::before {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border: 3px solid transparent;
    border - top - color: var(--secondary - color);
    border - radius: 50 %;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0 % {
        transform: rotate(0deg);
    }

    100 % {
        transform: rotate(360deg);
    }
}

.app - container {
    display: flex;
    flex - direction: column;
    height: 100vh;
    width: 100 %;
    overflow: hidden;
}

header {
    display: flex;
    justify - content: space - between;
    align - items: center;
    padding: 0.75rem 1.5rem;
    background - color: var(--primary - color);
    color: white;
    box - shadow: var(--shadow);
    z - index: 20;
    transition: background - color var(--transition - speed);
}

.dark - mode header {
    background - color: var(--gray - 900);
}

.logo - container {
    display: flex;
    align - items: center;
    gap: 1rem;
}

.logo - wrapper {
    width: 40px;
    height: 40px;
    overflow: hidden;
    border - radius: 50 %;
    background - color: white;
    display: flex;
    align - items: center;
    justify - content: center;
    box - shadow: var(--shadow);
    transition: transform 0.3s var(--transition - bounce);
}

    .logo - wrapper:hover {
    transform: scale(1.1);
}

.paf - logo {
    width: 35px;
    height: 35px;
    object - fit: contain;
}

.title - wrapper {
    display: flex;
    flex - direction: column;
}

    .title - wrapper h1 {
    font - size: 1.5rem;
    font - weight: 600;
    margin: 0;
    line - height: 1.2;
}

    .title - wrapper.subtitle {
    font - size: 0.8rem;
    opacity: 0.9;
}

.controls {
    display: flex;
    gap: 1rem;
}

.animated - btn {
    cursor: pointer;
    background - color: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border - radius: 50 %;
    display: flex;
    align - items: center;
    justify - content: center;
    font - size: 1.2rem;
    transition: all 0.3s var(--transition - bounce);
    position: relative;
    overflow: hidden;
}

    .animated - btn::before {
    content: '';
    position: absolute;
    top: 50 %;
    left: 50 %;
    width: 0;
    height: 0;
    background - color: rgba(255, 255, 255, 0.3);
    border - radius: 50 %;
    transform: translate(-50 %, -50 %);
    transition: width 0.3s ease - out, height 0.3s ease - out;
    z - index: -1;
}

    .animated - btn:hover {
    transform: translateY(-3px);
    box - shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

        .animated - btn: hover::before {
    width: 150 %;
    height: 150 %;
}

    .animated - btn:active {
    transform: translateY(0);
}

.main - content {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.sidebar {
    width: 320px;
    padding: 1rem;
    background - color: white;
    box - shadow: var(--shadow);
    overflow - y: auto;
    display: flex;
    flex - direction: column;
    gap: 1rem;
    z - index: 10;
    transition: background - color var(--transition - speed), transform 0.3s ease;
}

.dark - mode.sidebar {
    background - color: var(--gray - 800);
    color: var(--text - light);
}

.panel {
    background - color: var(--gray - 100);
    border - radius: var(--border - radius);
    padding: 1rem;
    box - shadow: var(--shadow - sm);
    transition: transform 0.3s ease, box - shadow 0.3s ease, background - color var(--transition - speed);
}

.dark - mode.panel {
    background - color: var(--gray - 700);
}

.panel:hover {
    transform: translateY(-2px);
    box - shadow: var(--shadow);
}

h3 {
    margin - bottom: 0.75rem;
    font - size: 1.1rem;
    color: var(--primary - color);
    display: flex;
    align - items: center;
    gap: 0.5rem;
    transition: color var(--transition - speed);
}

.dark - mode h3 {
    color: var(--primary - light);
}

.day - selector {
    display: flex;
    flex - direction: column;
}

.day - buttons {
    display: flex;
    flex - wrap: wrap;
    gap: 0.5rem;
}

    .day - buttons button {
    flex: 1;
    min - width: calc(33.33 % - 0.5rem);
    background - color: var(--primary - color);
    color: white;
    border: none;
    padding: 0.5rem;
    border - radius: var(--border - radius - sm);
    font - weight: 500;
    transition: all 0.2s ease;
}

        .day - buttons button:hover {
    background - color: var(--primary - dark);
    transform: translateY(-2px);
}

        .day - buttons button.active {
    background - color: var(--secondary - color);
    box - shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
}

.search - container {
    display: flex;
    flex - direction: column;
}

.search - input - group {
    display: flex;
    gap: 0.5rem;
    margin - bottom: 0.5rem;
}

input, select {
    transition: background - color var(--transition - speed), color var(--transition - speed), border - color var(--transition - speed);
    font - family: 'Poppins', sans - serif;
}

.search - container input {
    flex: 1;
    padding: 0.5rem 1rem;
    border: 1px solid var(--gray - 300);
    border - radius: var(--border - radius);
    font - size: 0.9rem;
}

.dark - mode input,
.dark - mode select {
    background - color: var(--gray - 600);
    color: var(--text - light);
    border - color: var(--gray - 500);
}

    .dark - mode input::placeholder {
    color: var(--gray - 400);
}

#searchButton {
    background - color: var(--primary - color);
    color: white;
    padding: 0.5rem;
    border: none;
    border - radius: var(--border - radius);
    cursor: pointer;
    transition: background - color 0.2s ease, transform 0.2s ease;
}

#searchButton:hover {
    background - color: var(--primary - dark);
    transform: translateY(-2px);
}

.pulse {
    animation: pulse - animation 2s infinite;
}

@keyframes pulse - animation {
    0 % {
        box- shadow: 0 0 0 0 rgba(0, 166, 211, 0.7);
}

70 % {
    box- shadow: 0 0 0 10px rgba(0, 166, 211, 0);
    }

100 % {
    box- shadow: 0 0 0 0 rgba(0, 166, 211, 0);
    }
}

#searchResult {
    margin - top: 0.5rem;
    font - size: 0.9rem;
    padding: 0.75rem;
    border - radius: var(--border - radius);
    background - color: var(--gray - 200);
    min - height: 2.5rem;
    transition: background - color var(--transition - speed), transform 0.3s ease;
}

.dark - mode #searchResult {
    background - color: var(--gray - 600);
}

#searchResult: not(: empty) {
    transform: translateY(0);
    animation: fadeIn 0.3s ease - out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.route - list {
    flex: 1;
    display: flex;
    flex - direction: column;
}

    .route - list h3 {
    display: flex;
    justify - content: space - between;
    align - items: center;
}

    .route - list ul {
    list - style: none;
    margin - top: 0.5rem;
    max - height: 400px;
    overflow - y: auto;
    padding - right: 0.5rem;
}

        .route - list ul:: -webkit - scrollbar {
    width: 8px;
}

        .route - list ul:: -webkit - scrollbar - track {
    background: var(--gray - 200);
    border - radius: 10px;
}

        .route - list ul:: -webkit - scrollbar - thumb {
    background: var(--gray - 400);
    border - radius: 10px;
}

.dark - mode.route - list ul:: -webkit - scrollbar - track {
    background: var(--gray - 700);
}

.dark - mode.route - list ul:: -webkit - scrollbar - thumb {
    background: var(--gray - 500);
}

.route - list li {
    padding: 0.75rem;
    border - radius: var(--border - radius);
    margin - bottom: 0.5rem;
    background - color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    justify - content: space - between;
    align - items: center;
    box - shadow: var(--shadow - sm);
    position: relative;
    overflow: hidden;
}

    .route - list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100 %;
    width: 4px;
    background - color: var(--primary - color);
    opacity: 0;
    transition: opacity 0.2s ease;
}

.dark - mode.route - list li {
    background - color: var(--gray - 700);
}

.route - list li:hover {
    transform: translateX(5px);
    box - shadow: var(--shadow);
}

    .route - list li: hover::before {
    opacity: 1;
}

.route - list li.restricted {
    background - color: #fff5f5;
    color: var(--danger - color);
}

    .route - list li.restricted::before {
    background - color: var(--danger - color);
}

.dark - mode.route - list li.restricted {
    background - color: #3c2c2c;
    color: #ffa5a5;
}

.route - list li.active {
    background - color: var(--primary - color);
    color: white;
    transform: translateX(5px);
    box - shadow: var(--shadow);
}

    .route - list li.active::before {
    background - color: var(--secondary - color);
    opacity: 1;
}

.route - driver {
    font - size: 0.8rem;
    opacity: 0.8;
    font - style: italic;
}

.map - container {
    flex: 1;
    position: relative;
    overflow: hidden;
}

#map {
    height: 100 %;
    width: 100 %;
    transition: filter 0.3s ease;
}

.dark - mode #map {
    filter: brightness(0.85) contrast(1.1);
}

.map - overlay {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z - index: 5;
    pointer - events: none;
}

.logo - watermark {
    width: 80px;
    height: 80px;
    opacity: 0.6;
    transition: opacity 0.3s ease, transform 0.3s ease;
}

    .logo - watermark:hover {
    opacity: 1;
    transform: scale(1.1);
}

.watermark {
    width: 100 %;
    height: 100 %;
    object - fit: contain;
}

/* Modal Styles */
.modal {
    display: none;
    position: fixed;
    z - index: 100;
    left: 0;
    top: 0;
    width: 100 %;
    height: 100 %;
    background - color: rgba(0, 0, 0, 0.7);
    transition: background - color var(--transition - speed);
    overflow - y: auto;
}

.modal - content {
    background - color: white;
    margin: 5 % auto;
    width: 90 %;
    max - width: 600px;
    border - radius: var(--border - radius - lg);
    box - shadow: var(--shadow - lg);
    position: relative;
    transition: background - color var(--transition - speed), color var(--transition - speed), transform 0.3s ease;
    overflow: hidden;
}

.dark - mode.modal - content {
    background - color: var(--gray - 800);
    color: var(--text - light);
}

.modal - header {
    background - color: var(--primary - color);
    color: white;
    padding: 1.25rem;
    display: flex;
    justify - content: space - between;
    align - items: center;
}

    .modal - header h2 {
    margin: 0;
    font - size: 1.5rem;
    display: flex;
    align - items: center;
    gap: 0.5rem;
}

.close {
    font - size: 1.75rem;
    cursor: pointer;
    transition: color var(--transition - speed);
    line - height: 1;
}

    .close:hover {
    color: var(--secondary - color);
}

#adminLogin, #adminControls {
    padding: 1.5rem;
}

#adminLogin {
    display: flex;
    flex - direction: column;
    gap: 1rem;
}

.input - group {
    display: flex;
    flex - direction: column;
    gap: 0.5rem;
}

    .input - group label {
    font - weight: 500;
    font - size: 0.9rem;
}

#adminPassword, .input - group input, .input - group select {
    padding: 0.75rem;
    border: 1px solid var(--gray - 300);
    border - radius: var(--border - radius);
    font - size: 0.95rem;
}

.primary - btn, .action - btn, .save - btn, .cancel - btn {
    display: flex;
    align - items: center;
    justify - content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border: none;
    border - radius: var(--border - radius);
    font - weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.primary - btn {
    background - color: var(--primary - color);
    color: white;
}

    .primary - btn:hover {
    background - color: var(--primary - dark);
    transform: translateY(-2px);
    box - shadow: var(--shadow);
}

.action - btn {
    background - color: var(--info - color);
    color: white;
}

    .action - btn:hover {
    background - color: #2980b9;
    transform: translateY(-2px);
    box - shadow: var(--shadow);
}

.save - btn {
    background - color: var(--success - color);
    color: white;
}

    .save - btn:hover {
    background - color: #27ae60;
    transform: translateY(-2px);
    box - shadow: var(--shadow);
}

.cancel - btn {
    background - color: var(--gray - 500);
    color: white;
}

    .cancel - btn:hover {
    background - color: var(--gray - 600);
    transform: translateY(-2px);
    box - shadow: var(--shadow);
}

.admin - section {
    margin - bottom: 2rem;
}

    .admin - section h3 {
    border - bottom: 1px solid var(--gray - 300);
    padding - bottom: 0.5rem;
    margin - bottom: 1rem;
}

.form - grid {
    display: grid;
    grid - template - columns: 1fr 1fr;
    gap: 1rem;
    margin - bottom: 1rem;
}

.checkbox - group {
    display: flex;
    align - items: center;
    gap: 0.75rem;
    margin - top: 0.5rem;
}

    .checkbox - group input[type = "checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.button - group {
    display: flex;
    gap: 1rem;
    margin - top: 1rem;
}

/* Info Window Styling */
.info - window {
    padding: 0.75rem;
    min - width: 200px;
}

    .info - window h3 {
    margin - bottom: 0.5rem;
    color: var(--primary - color);
    font - size: 1.1rem;
    border - bottom: 2px solid var(--primary - color);
    padding - bottom: 0.25rem;
}

    .info - window p {
    margin: 0.25rem 0;
    font - size: 0.9rem;
    display: flex;
    justify - content: space - between;
}

    .info - window.label {
    font - weight: 600;
    color: var(--gray - 700);
}

/* Toast Notifications */
#toast - container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z - index: 9999;
}

.toast {
    min - width: 250px;
    margin - bottom: 10px;
    background - color: white;
    color: var(--text - dark);
    border - radius: var(--border - radius);
    padding: 16px;
    box - shadow: var(--shadow - lg);
    display: flex;
    align - items: center;
    gap: 10px;
    animation: slideIn 0.3s, fadeOut 0.5s 2.5s;
    opacity: 0;
    pointer - events: none;
}

    .toast.success {
    border - left: 5px solid var(--success - color);
}

    .toast.error {
    border - left: 5px solid var(--danger - color);
}

    .toast.info {
    border - left: 5px solid var(--info - color);
}

    .toast.warning {
    border - left: 5px solid var(--warning - color);
}

@keyframes slideIn {
    from {
        transform: translateX(100 %);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

/* Accessibility improvements */
button,
    input,
    select {
    font - family: inherit;
}

button: focus,
    input: focus,
        select:focus {
    outline: 2px solid var(--primary - color);
    outline - offset: 2px;
}

/* Media Queries for Responsiveness */
@media(max - width: 992px) {
    .sidebar {
        width: 280px;
    }

    .form - grid {
        grid - template - columns: 1fr;
    }
}

@media(max - width: 768px) {
    .logo - container {
        gap: 0.5rem;
    }

    .logo - wrapper {
        width: 30px;
        height: 30px;
    }

    .paf - logo {
        width: 25px;
        height: 25px;
    }

    .title - wrapper h1 {
        font - size: 1.2rem;
    }

    .title - wrapper.subtitle {
        font - size: 0.7rem;
    }

    .main - content {
        flex - direction: column;
    }

    .sidebar {
        width: 100 %;
        max - height: 40vh;
        flex - shrink: 0;
    }

    .modal - content {
        margin - top: 1rem;
        width: 95 %;
    }

    .button - group {
        flex - direction: column;
    }
}

@media(max - width: 480px) {
    header {
        padding: 0.5rem 1rem;
    }

    .animated - btn {
        width: 35px;
        height: 35px;
        font - size: 1rem;
    }

    .day - buttons {
        flex - wrap: nowrap;
        overflow - x: auto;
        padding - bottom: 0.5rem;
    }

        .day - buttons button {
        flex: 0 0 auto;
        min - width: 80px;
        white - space: nowrap;
    }

    .map - overlay {
        bottom: 10px;
        right: 10px;
    }

    .logo - watermark {
        width: 60px;
        height: 60px;
    }

    .modal - header {
        padding: 1rem;
    }

        .modal - header h2 {
        font - size: 1.2rem;
    }

    #adminLogin, #adminControls {
        padding: 1rem;
    }
}
/* Walkthrough Tour Styles */
#tour - overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100 %;
    height: 100 %;
    background - color: rgba(0, 0, 0, 0.4);
    z - index: 9000;
    pointer - events: none;
}

#tour - overlay.with - highlight {
    background - color: rgba(0, 0, 0, 0.7);
    -webkit - backdrop - filter: blur(2px);
    backdrop - filter: blur(2px);
    transition: background - color 0.3s ease;
}

#tour - overlay.with - highlight::before {
    content: '';
    position: absolute;
    top: var(--highlight - top);
    left: var(--highlight - left);
    width: var(--highlight - width);
    height: var(--highlight - height);
    background - color: transparent;
    box - shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
    border - radius: 4px;
    z - index: -1;
    pointer - events: none;
}

#tour - tooltip {
    position: absolute;
    width: 320px;
    background - color: white;
    border - radius: var(--border - radius);
    box - shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    padding: 20px;
    z - index: 9001;
    pointer - events: auto;
}

.dark - mode #tour - tooltip {
    background - color: var(--gray - 800);
    color: var(--text - light);
    border: 1px solid var(--gray - 700);
}

#tour - title {
    margin - top: 0;
    margin - bottom: 10px;
    color: var(--primary - color);
    font - size: 1.3rem;
}

.dark - mode #tour - title {
    color: var(--primary - light);
}

#tour - content {
    margin - bottom: 20px;
    line - height: 1.6;
}

#tour - buttons {
    display: flex;
    justify - content: space - between;
    gap: 10px;
}

#tour - skip {
    background - color: var(--gray - 400);
    color: var(--gray - 800);
}

#tour - skip:hover {
    background - color: var(--gray - 500);
}

#tour - prev {
    background - color: var(--gray - 500);
    color: white;
}

#tour - prev:hover {
    background - color: var(--gray - 600);
}

#tour - next {
    background - color: var(--primary - color);
    color: white;
}

#tour - next:hover {
    background - color: var(--primary - dark);
}

#tour - skip, #tour - prev, #tour - next {
    padding: 8px 15px;
    border: none;
    border - radius: var(--border - radius - sm);
    cursor: pointer;
    font - weight: 500;
    transition: background - color 0.2s ease, transform 0.2s ease;
}

#tour - skip: hover, #tour - prev: hover, #tour - next:hover {
    transform: translateY(-2px);
}

.tour - highlight {
    position: relative;
    z - index: 9002;
    pointer - events: auto;
    animation: pulse - highlight 2s infinite;
}

@keyframes pulse - highlight {
    0 % {
        box- shadow: 0 0 0 0 rgba(0, 166, 211, 0.6);
}

70 % {
    box- shadow: 0 0 0 10px rgba(0, 166, 211, 0);
    }

100 % {
    box- shadow: 0 0 0 0 rgba(0, 166, 211, 0);
    }
}

/* Help button */
#helpButton {
    background - color: var(--info - color);
}

#helpButton:hover {
    background - color: #2980b9;
}
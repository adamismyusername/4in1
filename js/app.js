// DOM Elements
const form = document.getElementById('urlForm');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const previewBtn = document.getElementById('previewBtn');
const previewSection = document.getElementById('previewSection');
const url1Preview = document.getElementById('url1Preview');
const url2Preview = document.getElementById('url2Preview');
const url3Preview = document.getElementById('url3Preview');
const url4Preview = document.getElementById('url4Preview');
const templateSelect = document.getElementById('html_file');
const loadingIndicator = document.getElementById('loadingIndicator');

// Store generated URLs
let generatedUrls = {
    url1: '',
    url2: '',
    url3: '',
    url4: ''
};

// Store HTML template content
let templateContent = '';

// Store modified HTML content
let modifiedHtmlContent = '';

// Default templates to use if JSON file can't be loaded
const defaultTemplates = [
    {
        name: "FourInOneEmail v1 (Hannity/Trump/Musk | Musk $36T | IRS Loophole | Gold Standard)",
        path: "templates/FourInOneEmail.html",
        description: "Four-in-one email template with multiple link placements"
    },
    {
        name: "FourInOneEmail v2 (Hannity/Trump/Musk | Dollar Crash | IRS Loophole | Shocking Gold)",
        path: "templates/FourInOneEmail-v2.html"
    },
    {
        name: "FourInOneEmail v3 (Hannity/Biden | Musk $36T | DQ Warning | Video Cash vs Gold)",v
        path: "templates/FourInOneEmail-v3.html"
    },
    {
        name: "FourInOneEmail v4 (Hannity|Trump | Retirement Checklist | Beginners Guide | Digital Dollar)",
        path: "templates/FourInOneEmail-v4.html"
    },
    {
        name: "FourInOneEmail v5 (Hannity/Stagflation | Avalanche | DQ Warning | Beginners Guide)",
        path: "templates/FourInOneEmail-v5.html"
    },
    {
        name: "FourInOneEmail v6 (Video Cash vs Gold | IRS Loophole | Retirement Checklist | Musk $36T)",
        path: "templates/FourInOneEmail-v6.html"
    },
    {
        name: "FourInOneEmail v7 (Beginners Guide | Hannity/Biden | DQ Warning | Digital Dollar )",
        path: "templates/FourInOneEmail-v7.html"
    }
];

// Event Listeners
document.addEventListener('DOMContentLoaded', init);
generateBtn.addEventListener('click', generateUrls);
resetBtn.addEventListener('click', resetForm);
downloadBtn.addEventListener('click', downloadHtml);
previewBtn.addEventListener('click', previewTemplate);
templateSelect.addEventListener('change', loadSelectedTemplate);

/**
 * Initialize the application
 */
async function init() {
    // Set today's date
    document.getElementById('send_date').valueAsDate = new Date();
    
    // Load template list
    await loadTemplateList();
    
    // Load the initial template
    await loadSelectedTemplate();
}

/**
 * Load the list of available templates
 */
async function loadTemplateList() {
    try {
        // Show loading indicator
        if (loadingIndicator) loadingIndicator.classList.remove('hide');
        
        // Clear existing options
        templateSelect.innerHTML = '';
        
        try {
            // Attempt to fetch templates.json
            const response = await fetch('templates.json');
            
            if (!response.ok) {
                throw new Error(`Failed to load templates: ${response.statusText}`);
            }
            
            const templatesData = await response.json();
            
            // Add template options from templates.json
            templatesData.templates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.path.split('/').pop(); // Extract filename from path
                option.textContent = template.name;
                templateSelect.appendChild(option);
            });
        } catch (jsonError) {
            console.warn('Could not load templates.json, using default templates:', jsonError);
            
            // If templates.json fails to load, use default templates
            defaultTemplates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.path.split('/').pop(); // Extract filename from path
                option.textContent = template.name;
                templateSelect.appendChild(option);
            });
        }
        
        // Hide loading indicator
        if (loadingIndicator) loadingIndicator.classList.add('hide');
    } catch (error) {
        console.error('Error in loadTemplateList:', error);
        
        // As a last resort, add FourInOneEmail.html as a fallback
        const option = document.createElement('option');
        option.value = 'FourInOneEmail.html';
        option.textContent = 'FourInOneEmail v1';
        templateSelect.appendChild(option);
        
        if (loadingIndicator) loadingIndicator.classList.add('hide');
    }
}

/**
 * Load the selected HTML template
 */
async function loadSelectedTemplate() {
    const selectedTemplate = templateSelect.value;
    
    if (!selectedTemplate) {
        // Disable preview button if no template selected
        previewBtn.disabled = true;
        return;
    }
    
    try {
        // Show loading indicator
        if (loadingIndicator) loadingIndicator.classList.remove('hide');
        
        // Disable preview button while loading
        previewBtn.disabled = true;
        
        // Get the full path for the selected template
        const templatePath = `templates/${selectedTemplate}`;
        
        // Fetch the template content
        const response = await fetch(templatePath);
        
        if (!response.ok) {
            throw new Error(`Failed to load template: ${response.statusText}`);
        }
        
        templateContent = await response.text();
        
        // Enable preview button after successful load
        previewBtn.disabled = false;
        
        // Hide loading indicator
        if (loadingIndicator) loadingIndicator.classList.add('hide');
    } catch (error) {
        console.error('Error loading template:', error);
        alert(`Failed to load template: ${error.message}`);
        
        // Set a minimal HTML template as fallback
        templateContent = `<!DOCTYPE html>
<html>
<head>
    <title>Email Template</title>
</head>
<body>
    <p>Template could not be loaded. This is a fallback template.</p>
    <p>Link 1: <a href="#link1">#link1</a></p>
    <p>Link 2: <a href="#link2">#link2</a></p>
    <p>Link 3: <a href="#link3">#link3</a></p>
    <p>Link 4: <a href="#link4">#link4</a></p>
</body>
</html>`;
        
        // Enable preview button even with fallback template
        previewBtn.disabled = false;
        
        if (loadingIndicator) loadingIndicator.classList.add('hide');
    }
}

/**
 * Preview the selected HTML template in a new tab
 */
function previewTemplate() {
    if (!templateContent) {
        alert('Please wait for the HTML template to load.');
        return;
    }
    
    // Create a blob with the template content
    const blob = new Blob([templateContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open in a new tab
    const newWindow = window.open(url, '_blank');
    
    // Clean up the blob URL after a short delay
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
    
    // If popup was blocked, provide alternative
    if (!newWindow) {
        alert('Popup blocked! Please allow popups for this site or try again.');
    }
}

/**
 * Generate URLs based on form inputs
 */
function generateUrls() {
    // Check if template is loaded
    if (!templateContent) {
        alert('Please wait for the HTML template to load.');
        return;
    }
    
    // Check form validity
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get all form values
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    // Generate URLs
    const urls = {
        url1: buildUrl(formValues, 1),
        url2: buildUrl(formValues, 2),
        url3: buildUrl(formValues, 3),
        url4: buildUrl(formValues, 4)
    };

    // Store generated URLs
    generatedUrls = urls;

    // Update preview
    url1Preview.textContent = urls.url1;
    url2Preview.textContent = urls.url2;
    url3Preview.textContent = urls.url3;
    url4Preview.textContent = urls.url4;

    // Show preview section
    previewSection.classList.remove('hide');

    // Enable download button
    downloadBtn.disabled = false;

    // Modify HTML content - replace all occurrences of placeholders
    modifiedHtmlContent = templateContent
        .replaceAll('#link1', urls.url1)
        .replaceAll('#link2', urls.url2)
        .replaceAll('#link3', urls.url3)
        .replaceAll('#link4', urls.url4);
        
    // Scroll to preview section
    previewSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Build URL with parameters for a specific variant
 * @param {Object} formValues - Form field values
 * @param {number} variantNumber - Variant number (1-4)
 * @returns {string} Generated URL
 */
function buildUrl(formValues, variantNumber) {
    const {
        campaign_name,
        phone,
        utm_medium,
        utm_content,
        utm_term
    } = formValues;

    // Get values and replace spaces with hyphens
    const variant = (formValues[`variant_${variantNumber}`] || '').replace(/ /g, '-');
    const campaignId = formValues[`campaign_id_${variantNumber}`];
    const landingPage = formValues[`landing_page_${variantNumber}`];
    const cleanCampaignName = campaign_name.replace(/ /g, '-');
    const cleanUtmMedium = utm_medium.replace(/ /g, '-');
    const cleanUtmContent = utm_content ? utm_content.replace(/ /g, '-') : '';
    const cleanUtmTerm = utm_term ? utm_term.replace(/ /g, '-') : '';
    
    // Format: landing_page/?sfcid=campaign_id&ls=001-utm_medium-campaign_name&cn=phone&utm_source=campaign_name&utm_medium=utm_medium&utm_campaign=campaign_id&variant=variant
    let url = `${landingPage}/?sfcid=${campaignId}&ls=001-${cleanUtmMedium}-${cleanCampaignName}`;
    
    // Add optional parameters if they exist
    if (phone) url += `&cn=${phone}`;
    
    // Add required parameters
    url += `&utm_source=${cleanCampaignName}&utm_medium=${cleanUtmMedium}&utm_campaign=${campaignId}`;
    
    // Add optional variant if it exists
    if (variant) url += `&variant=${variant}`;
    
    // Add optional utm_content if it exists
    if (cleanUtmContent) url += `&utm_content=${cleanUtmContent}`;
    
    // Add optional utm_term if it exists
    if (cleanUtmTerm) url += `&utm_term=${cleanUtmTerm}`;
    
    return url;
}

/**
 * Reset the form to its initial state
 */
function resetForm() {
    form.reset();
    
    // Reset date field to today
    document.getElementById('send_date').valueAsDate = new Date();
    
    // Hide preview section
    previewSection.classList.add('hide');
    
    // Disable download button
    downloadBtn.disabled = true;
    
    // Clear modified HTML content
    modifiedHtmlContent = '';
    
    // Re-enable preview button if template is loaded
    if (templateContent) {
        previewBtn.disabled = false;
    }
}

/**
 * Download the modified HTML file
 */
function downloadHtml() {
    if (!modifiedHtmlContent) {
        alert('Please generate URLs first.');
        return;
    }

    // Create file for download
    const blob = new Blob([modifiedHtmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create an anchor element for downloading
    const a = document.createElement('a');
    a.href = url;
    
    // Get selected template name and campaign name for filename
    const templateName = templateSelect.value.split('.')[0];
    const campaignName = document.getElementById('campaign_name').value;
    const date = new Date().toISOString().split('T')[0];
    
    // Set filename
    a.download = `${templateName}_${campaignName}_${date}.html`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

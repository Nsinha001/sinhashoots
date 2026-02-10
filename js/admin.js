// Photo Upload Manager
document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const photoFile = document.getElementById('photoFile');
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('previewContainer');
    const uploadMessage = document.getElementById('uploadMessage');
    const clearFormBtn = document.getElementById('clearForm');
    const uploadedPhotosContainer = document.getElementById('uploadedPhotos');
    const categoryTabs = document.querySelectorAll('.tab-btn');

    // Initialize photos from localStorage
    let photos = [];
    try {
        const data = JSON.parse(localStorage.getItem('portfolioPhotos') || '[]');
        // Validate that data is an array
        if (Array.isArray(data)) {
            // Filter and validate each photo object
            photos = data.filter(p => 
                p && typeof p === 'object' && 
                p.id && p.title && p.category && p.imageData
            );
        }
    } catch (e) {
        console.error('Error loading photos from localStorage:', e);
        photos = [];
    }

    // Preview image when file is selected
    if (photoFile) {
        photoFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showMessage('File size must be less than 5MB', 'error');
                    photoFile.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    imagePreview.src = event.target.result;
                    previewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                previewContainer.style.display = 'none';
            }
        });
    }

    // Handle form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('photoTitle').value;
            const description = document.getElementById('photoDescription').value;
            const category = document.getElementById('photoCategory').value;
            const file = photoFile.files[0];

            if (!file) {
                showMessage('Please select a photo', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const photo = {
                    id: Date.now(),
                    title: title,
                    description: description,
                    category: category,
                    imageData: event.target.result,
                    uploadDate: new Date().toISOString()
                };

                photos.push(photo);
                localStorage.setItem('portfolioPhotos', JSON.stringify(photos));

                showMessage('Photo uploaded successfully!', 'success');
                uploadForm.reset();
                previewContainer.style.display = 'none';
                displayPhotos();

                // Hide success message after 3 seconds
                setTimeout(() => {
                    uploadMessage.className = 'upload-message';
                }, 3000);
            };
            reader.readAsDataURL(file);
        });
    }

    // Clear form
    if (clearFormBtn) {
        clearFormBtn.addEventListener('click', () => {
            uploadForm.reset();
            previewContainer.style.display = 'none';
            uploadMessage.className = 'upload-message';
        });
    }

    // Category filter tabs
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.getAttribute('data-category');
            displayPhotos(category);
        });
    });

    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Helper function to validate data URL
    function isValidDataUrl(url) {
        return typeof url === 'string' && url.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/);
    }

    // Display photos in the gallery
    function displayPhotos(filterCategory = 'all') {
        if (!uploadedPhotosContainer) return;

        const filteredPhotos = filterCategory === 'all' 
            ? photos 
            : photos.filter(p => p.category === filterCategory);

        if (filteredPhotos.length === 0) {
            uploadedPhotosContainer.innerHTML = '<p class="empty-message">No photos in this category yet.</p>';
            return;
        }

        uploadedPhotosContainer.innerHTML = filteredPhotos.map(photo => {
            // Validate data URL before using
            const imageSrc = isValidDataUrl(photo.imageData) ? photo.imageData : '';
            return `
            <div class="photo-card" data-id="${photo.id}">
                <img src="${imageSrc}" alt="${escapeHtml(photo.title)}" class="photo-card-image">
                <div class="photo-card-info">
                    <div class="photo-card-title">${escapeHtml(photo.title)}</div>
                    <div class="photo-card-category">${escapeHtml(photo.category)}</div>
                </div>
                <div class="photo-card-actions">
                    <button class="delete-btn" data-photo-id="${photo.id}" title="Delete photo">×</button>
                </div>
            </div>
        `;
        }).join('');
        
        // Add event listeners to delete buttons
        uploadedPhotosContainer.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const photoId = parseInt(btn.getAttribute('data-photo-id'));
                deletePhoto(photoId);
            });
        });
    }

    // Delete photo function
    function deletePhoto(photoId) {
        if (confirm('Are you sure you want to delete this photo?')) {
            photos = photos.filter(p => p.id !== photoId);
            localStorage.setItem('portfolioPhotos', JSON.stringify(photos));
            
            // Get current active category
            const activeTab = document.querySelector('.tab-btn.active');
            const category = activeTab ? activeTab.getAttribute('data-category') : 'all';
            
            displayPhotos(category);
            showMessage('Photo deleted successfully', 'success');
            
            setTimeout(() => {
                uploadMessage.className = 'upload-message';
            }, 2000);
        }
    }

    // Show message helper
    function showMessage(message, type) {
        if (uploadMessage) {
            uploadMessage.textContent = message;
            uploadMessage.className = `upload-message ${type}`;
        }
    }

    // Initial display
    displayPhotos();
});

// Export photos count for portfolio page
function getUploadedPhotos() {
    return JSON.parse(localStorage.getItem('portfolioPhotos') || '[]');
}

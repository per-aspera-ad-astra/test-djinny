window.addEventListener('DOMContentLoaded', truncateDescription);

// Truncate text
function truncateDescription() {
    const allCardTexts = document.querySelectorAll('.card-text');

    if (allCardTexts) {
        allCardTexts.forEach(item => {
            const truncateClass = 'card-text-truncate'; 
            const itemHeight = 48; // font-size 16px * 2 + line-height 1.5 * 2
            const showMoreBtn = document.createElement('div');
            showMoreBtn.classList.add('fw-bold', 'card-more');
            showMoreBtn.innerText = 'Show more...'
            
            if (item.offsetHeight > itemHeight) {
                item.classList.add(truncateClass);
                item.insertAdjacentElement('afterend', showMoreBtn);
            }

            showMoreBtn.addEventListener('click', () => {
                item.classList.remove(truncateClass);
                showMoreBtn.remove();
            });
        });
    }
}


// Dark mode
const checkbox = document.querySelector('input[name=theme_switch]');
const navbar = document.querySelector('.navbar');

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    checkbox.checked = true;
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    checkbox.checked = false;
}

checkbox.addEventListener('change', (cb) => {
    document.documentElement.setAttribute(
        'data-theme',
        cb.target.checked ? 'dark' : 'light'
    );

    if (cb.target.checked) {
        navbar.classList.add('navbar-dark');
    } else {
        navbar.classList.remove('navbar-dark');
    }
});


// Infinite scroll
(function () {

    const cardsEl = document.getElementById('cards');
    const loaderEl = document.querySelector('.loader');

    const getCards = async (page, limit) => {
        const API_URL = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`An error occurred: ${response.status}`);
        }
        return await response.json();
    }

    const showCards = (cards) => {
        cards.forEach(item => {
            const cardEl = document.createElement('div');
            cardEl.classList.add('col-md-6', 'mb-4');

            cardEl.innerHTML = `
                <div class="card overflow-hidden">
                    <div class="card-img">
                        <img src="${item.download_url}" alt="">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title mb-1">Heading</h5>
                        <p class="card-text mb-2">And here full text doesn’t fit, and at the very end of it we should show a truncatio here goes some sample, example text that is relatively short. And here full text doesn’t fit, and at the very end of it we should show a truncatio here goes some sample, example text that is relatively short.</p>
                    </div>
                    <div class="card-footer p-3">
                        <a href="#" class="btn btn-primary me-3">Save to collection</a>
                        <a href="#" class="btn btn-outline-secondary">Share</a>
                    </div>
                </div>
            `
            cardsEl.appendChild(cardEl);

        });

        truncateDescription();
    };

    const hideLoader = () => {
        loaderEl.classList.remove('show');
    };

    const showLoader = () => {
        loaderEl.classList.add('show');
    };

    const loadCards = async (page, limit) => {
        showLoader();

        // 0.5 second later
        setTimeout(async () => {
            try {
                const response = await getCards(page, limit);
    
                showCards(response);
     
            } catch (error) {
                console.log(error.message);
            } finally {
                hideLoader();
            }
        }, 500);

    };

    // control variables
    let currentPage = 1;
    const limit = 10;

    window.addEventListener('scroll', () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 5 ) {
            currentPage++;
            loadCards(currentPage, limit);
        }
    }, {
        passive: true
    });

    loadCards(currentPage, limit);
})();
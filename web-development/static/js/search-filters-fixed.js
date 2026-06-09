// Elementos del DOM
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const alcoholFilter = document.getElementById('alcohol-filter');
const priceFilter = document.getElementById('price-filter');
const sortFilter = document.getElementById('sort-filter');
const resetFiltersBtn = document.getElementById('reset-filters');
const resultsCount = document.getElementById('results-count');
const noResults = document.getElementById('no-results');
const menuContainer = document.querySelector('.main__menu');

// Estado de los filtros
let currentFilters = {
    search: '',
    alcohol: 'all',
    price: 'all',
    sort: 'name'
};

// Función para filtrar bebidas
function filterDrinks() {
    const drinks = Array.from(menuContainer.children);
    let visibleDrinks = drinks;

    // Filtro de búsqueda
    if (currentFilters.search) {
        visibleDrinks = visibleDrinks.filter(drink => {
            const name = drink.querySelector('.card-title').textContent.toLowerCase();
            const description = drink.querySelector('.card-text').textContent.toLowerCase();
            return name.includes(currentFilters.search.toLowerCase()) ||
                   description.includes(currentFilters.search.toLowerCase());
        });
    }

    // Filtro de alcohol
    if (currentFilters.alcohol !== 'all') {
        visibleDrinks = visibleDrinks.filter(drink => {
            const isAlcoholic = drink.querySelector('.card').dataset.alcoholic === 'true';
            return currentFilters.alcohol === 'alcoholic' ? isAlcoholic : !isAlcoholic;
        });
    }

    // Filtro de precio
    if (currentFilters.price !== 'all') {
        visibleDrinks = visibleDrinks.filter(drink => {
            const priceText = drink.querySelector('.card-price').textContent;
            const price = parseInt(priceText.match(/\d+/)[0]);
            switch (currentFilters.price) {
                case 'low': return price <= 100;
                case 'medium': return price > 100 && price <= 150;
                case 'high': return price > 150;
                default: return true;
            }
        });
    }

    // Ordenamiento
    visibleDrinks.sort((a, b) => {
        const nameA = a.querySelector('.card-title').textContent;
        const nameB = b.querySelector('.card-title').textContent;
        const priceA = parseInt(a.querySelector('.card-price').textContent.match(/\d+/)[0]);
        const priceB = parseInt(b.querySelector('.card-price').textContent.match(/\d+/)[0]);

        switch (currentFilters.sort) {
            case 'name':
                return nameA.localeCompare(nameB);
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'popular':
                return nameA.localeCompare(nameB);
            default:
                return 0;
        }
    });

    // Mostrar/ocultar bebidas según filtros
    drinks.forEach(drink => drink.style.display = 'none');
    visibleDrinks.forEach(drink => {
        drink.style.display = '';
        drink.style.animation = 'fadeIn 0.5s ease-out';
    });

    // Actualizar contador de resultados
    if (resultsCount) {
        resultsCount.textContent = `${visibleDrinks.length} bebidas encontradas`;
    }
    
    // Mostrar mensaje de no resultados si es necesario
    if (noResults) {
        noResults.style.display = visibleDrinks.length === 0 ? 'block' : 'none';
    }
    if (menuContainer) {
        menuContainer.style.display = visibleDrinks.length === 0 ? 'none' : 'grid';
    }
}

// Event Listeners
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        if (clearSearchBtn) {
            clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
        }
        filterDrinks();
    });
}

if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
        if (searchInput) {
            searchInput.value = '';
        }
        currentFilters.search = '';
        clearSearchBtn.style.display = 'none';
        filterDrinks();
    });
}

if (alcoholFilter) {
    alcoholFilter.addEventListener('change', (e) => {
        currentFilters.alcohol = e.target.value;
        filterDrinks();
    });
}

if (priceFilter) {
    priceFilter.addEventListener('change', (e) => {
        currentFilters.price = e.target.value;
        filterDrinks();
    });
}

if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        filterDrinks();
    });
}

if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
        // Resetear todos los filtros
        currentFilters = {
            search: '',
            alcohol: 'all',
            price: 'all',
            sort: 'name'
        };

        // Resetear UI
        if (searchInput) searchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        if (alcoholFilter) alcoholFilter.value = 'all';
        if (priceFilter) priceFilter.value = 'all';
        if (sortFilter) sortFilter.value = 'name';

        // Aplicar filtros reseteados
        filterDrinks();
    });
}

// Inicializar filtros cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para que las bebidas se carguen primero
    setTimeout(() => {
        if (menuContainer && menuContainer.children.length > 0) {
            filterDrinks();
        }
    }, 100);
});

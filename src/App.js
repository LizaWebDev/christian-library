import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import { books } from './data';

function App() {
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [fontSize, setFontSize] = useState(18);
    const [darkMode, setDarkMode] = useState(false);
    const [showVerseNumbers, setShowVerseNumbers] = useState(true);
    const [expandedSections, setExpandedSections] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
    const [showSearch, setShowSearch] = useState(false);

    // Определяем мобильное устройство
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Восстановление настроек
    useEffect(() => {
        const savedFontSize = localStorage.getItem('fontSize');
        const savedDarkMode = localStorage.getItem('darkMode');
        const savedVerseNumbers = localStorage.getItem('showVerseNumbers');

        if (savedFontSize) setFontSize(Number(savedFontSize));
        if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
        if (savedVerseNumbers) setShowVerseNumbers(savedVerseNumbers === 'true');

        // Автоматически разворачиваем разделы
        setExpandedSections({
            'old-testament': true, 'new-testament': true, 'marcion-gospel': true,
            'apostolikon': true, 'nag-hammadi': true, 'other': true
        });
    }, []);

    // Сохранение настроек шрифта
    useEffect(() => {
        localStorage.setItem('fontSize', fontSize.toString());
    }, [fontSize]);

    // Поиск по текстам
    const performSearch = useCallback((query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setCurrentSearchIndex(-1);
            return;
        }

        const results = [];
        const lowerQuery = query.toLowerCase();

        books.forEach(book => {
            book.chapters.forEach((chapter, chapterIndex) => {
                chapter.content.forEach((verse, verseIndex) => {
                    if (verse.toLowerCase().includes(lowerQuery)) {
                        results.push({ bookId: book.id, bookTitle: book.title, chapterIndex, verseIndex, verse });
                    }
                });
            });
        });

        setSearchResults(results);
        setCurrentSearchIndex(results.length > 0 ? 0 : -1);
    }, []);

    // Переход к найденному результату
    const goToSearchResult = useCallback((result) => {
        const book = books.find(b => b.id === result.bookId);
        if (book) {
            setSelectedBook(book);
            setSelectedChapter(result.chapterIndex);

            setTimeout(() => {
                const verseElement = document.getElementById(`verse-${result.bookId}-${result.chapterIndex}-${result.verseIndex}`);
                if (verseElement) {
                    verseElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    verseElement.classList.add('search-current');

                    setTimeout(() => {
                        verseElement.classList.remove('search-current');
                    }, 2000);
                }
            }, 100);
        }
    }, []);

    // Навигация по результатам поиска
    const navigateSearchResults = useCallback((direction) => {
        if (searchResults.length === 0) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = (currentSearchIndex + 1) % searchResults.length;
        } else {
            newIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
        }

        setCurrentSearchIndex(newIndex);
        goToSearchResult(searchResults[newIndex]);
    }, [searchResults, currentSearchIndex, goToSearchResult]);

    const handleBookSelect = useCallback((book) => {
        setSelectedBook(book);
        setSelectedChapter(0);
        setSearchQuery('');
        setSearchResults([]);
        setCurrentSearchIndex(-1);
        window.scrollTo(0, 0);
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [isMobile]);

    const handleChapterSelect = useCallback((index) => {
        setSelectedChapter(index);
        window.scrollTo(0, 0);
    }, []);

    const nextChapter = useCallback(() => {
        if (selectedBook && selectedChapter < selectedBook.chapters.length - 1) {
            setSelectedChapter(selectedChapter + 1);
            window.scrollTo(0, 0);
        }
    }, [selectedBook, selectedChapter]);

    const prevChapter = useCallback(() => {
        if (selectedBook && selectedChapter > 0) {
            setSelectedChapter(selectedChapter - 1);
            window.scrollTo(0, 0);
        }
    }, [selectedBook, selectedChapter]);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    const increaseFontSize = useCallback(() => {
        setFontSize(prev => Math.min(prev + 1, 24));
    }, []);

    const decreaseFontSize = useCallback(() => {
        setFontSize(prev => Math.max(prev - 1, 14));
    }, []);

    const toggleDarkMode = useCallback(() => {
        setDarkMode(prev => {
            localStorage.setItem('darkMode', !prev);
            return !prev;
        });
    }, []);

    const toggleVerseNumbers = useCallback(() => {
        setShowVerseNumbers(prev => {
            localStorage.setItem('showVerseNumbers', !prev);
            return !prev;
        });
    }, []);

    const toggleSearch = useCallback(() => {
        setShowSearch(prev => !prev);
        if (showSearch) {
            setSearchQuery('');
            setSearchResults([]);
            setCurrentSearchIndex(-1);
        }
    }, [showSearch]);

    const toggleSection = useCallback((section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }, []);

    // Функция для рендеринга текста с подсветкой поиска
    const renderTextWithVerses = useCallback((content) => {
        return content.map((verse, index) => {
            const verseId = `verse-${selectedBook.id}-${selectedChapter}-${index}`;
            const isCurrentSearch = currentSearchIndex >= 0 &&
                searchResults[currentSearchIndex]?.bookId === selectedBook.id &&
                searchResults[currentSearchIndex]?.chapterIndex === selectedChapter &&
                searchResults[currentSearchIndex]?.verseIndex === index;

            let highlightedVerse = verse;
            if (searchQuery) {
                const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                highlightedVerse = verse.replace(regex, '<mark class="search-highlight">$1</mark>');
            }

            return (
                <div
                    key={index}
                    className={`verse-container ${isCurrentSearch ? 'search-current' : ''}`}
                    id={verseId}
                >
                    {showVerseNumbers && (
                        <span className="verse-number">
                            {index + 1}
                        </span>
                    )}
                    <span
                        className="verse-text"
                        dangerouslySetInnerHTML={{ __html: highlightedVerse }}
                    />
                </div>
            );
        });
    }, [searchQuery, searchResults, currentSearchIndex, selectedBook, selectedChapter, showVerseNumbers]);

    // Группируем книги по категориям
    const booksByCategory = useMemo(() => ({
        'old-testament': books.filter(book => book.category === 'old-testament'),
        'new-testament': books.filter(book => book.category === 'new-testament'),
        'marcion-gospel': books.filter(book => book.category === 'marcion-gospel'),
        'apostolikon': books.filter(book => book.category === 'apostolikon'),
        'nag-hammadi': books.filter(book => book.category === 'nag-hammadi'),
        'other': books.filter(book => book.category === 'other')
    }), []);

    const categoryTitles = {
        'old-testament': 'Ветхий Завет',
        'new-testament': 'Новый Завет',
        'marcion-gospel': 'Евангелие Господне',
        'apostolikon': 'Апостоликон Маркиона',
        'nag-hammadi': 'Апокрифы Наг-Хаммади',
        'other': 'Другие тексты'
    };

    const categoryClasses = {
        'marcion-gospel': 'marcion-gospel-header',
        'apostolikon': 'apostolikon-header'
    };

    return (
        <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
            <header className="app-header">
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <div className="app-logo">
                        <svg width="28" height="28" viewBox="0 0 32 32" className="app-icon">
                            <path d="M6 4C4.89543 4 4 4.89543 4 6V26C4 27.1046 4.89543 28 6 28H26C27.1046 28 28 27.1046 28 26V6C28 4.89543 27.1046 4 26 4H6Z"
                                  fill="#ffffff" stroke="#ffffff" strokeWidth="1"/>
                            <path d="M9 8H23V12H9V8Z" fill="#3a506b"/>
                            <path d="M9 14H23V16H9V14Z" fill="#3a506b"/>
                            <path d="M9 18H23V20H9V18Z" fill="#3a506b"/>
                            <path d="M9 22H19V24H9V22Z" fill="#3a506b"/>
                            <path d="M24 8H26V24H24V8Z" fill="#8b4513"/>
                            <circle cx="26" cy="6" r="2" fill="#d4af37"/>
                        </svg>
                    </div>
                </button>
                <h1>Христианская библиотека</h1>
                <div className="controls">
                    <button onClick={decreaseFontSize} title="Уменьшить шрифт">A-</button>
                    <span className="font-size-label">{fontSize}px</span>
                    <button onClick={increaseFontSize} title="Увеличить шрифт">A+</button>
                    <button
                        onClick={toggleVerseNumbers}
                        title={showVerseNumbers ? "Скрыть номера стихов" : "Показать номера стихов"}
                        className={showVerseNumbers ? 'active' : ''}
                    >
                        №
                    </button>
                    <button
                        onClick={toggleSearch}
                        title="Поиск"
                        className={showSearch ? 'active' : ''}
                    >
                        🔍
                    </button>
                    <button onClick={toggleDarkMode} title="Ночной режим">
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </header>

            {/* Поисковая панель */}
            {showSearch && (
                <div className="search-panel">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Введите слово или фразу для поиска..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                performSearch(e.target.value);
                            }}
                            className="search-input-large"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchResults.length > 0) {
                                    navigateSearchResults('next');
                                }
                                if (e.key === 'Escape') {
                                    setShowSearch(false);
                                    setSearchQuery('');
                                    setSearchResults([]);
                                }
                            }}
                        />
                        {searchResults.length > 0 && (
                            <div className="search-results-info">
                                <span className="search-count">
                                    Найдено: {searchResults.length} совпадений
                                </span>
                                <div className="search-navigation">
                                    <span className="current-position">
                                        {currentSearchIndex + 1} / {searchResults.length}
                                    </span>
                                    <button
                                        onClick={() => navigateSearchResults('prev')}
                                        disabled={searchResults.length <= 1}
                                        title="Предыдущий результат"
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={() => navigateSearchResults('next')}
                                        disabled={searchResults.length <= 1}
                                        title="Следующий результат"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                        )}
                        {searchQuery && searchResults.length === 0 && (
                            <div className="search-no-results">
                                Ничего не найдено для "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="main-content">
                {/* Overlay для мобильных устройств */}
                {isMobile && sidebarOpen && (
                    <div className="sidebar-overlay" onClick={closeSidebar} />
                )}

                <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-content">
                        <div className="sidebar-header">
                            <h2>Книги</h2>
                            {isMobile && (
                                <button className="close-sidebar" onClick={closeSidebar} title="Закрыть меню">
                                    ✕
                                </button>
                            )}
                        </div>
                        <div className="book-categories">
                            {Object.entries(booksByCategory).map(([category, categoryBooks]) => (
                                categoryBooks.length > 0 && (
                                    <div key={category} className="category-section">
                                        <h3
                                            onClick={() => toggleSection(category)}
                                            className={`category-header ${categoryClasses[category] || ''}`}
                                        >
                                            <span className="collapse-icon">
                                                {expandedSections[category] ? '▼' : '►'}
                                            </span>
                                            {categoryTitles[category]}
                                            <span className="book-count">({categoryBooks.length})</span>
                                        </h3>
                                        {expandedSections[category] && categoryBooks.map(book => (
                                            <div
                                                key={book.id}
                                                className={`book-item ${selectedBook?.id === book.id ? 'selected' : ''}`}
                                                data-category={category}
                                                onClick={() => handleBookSelect(book)}
                                            >
                                                {book.title}
                                            </div>
                                        ))}
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="reader">
                    {!selectedBook ? (
                        <div className="welcome-message">
                            <h2>Добро пожаловать в библиотеку христианских текстов!</h2>
                            <p>Выберите книгу из меню для начала чтения.</p>
                            <div className="welcome-stats">
                                <div className="stat">
                                    <span className="stat-number">{books.length}</span>
                                    <span className="stat-label">книг</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">{
                                        books.reduce((total, book) => total + book.chapters.length, 0)
                                    }</span>
                                    <span className="stat-label">глав</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">{
                                        books.reduce((total, book) => total +
                                            book.chapters.reduce((chapTotal, chapter) =>
                                                chapTotal + chapter.content.length, 0), 0)
                                    }</span>
                                    <span className="stat-label">стихов</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="reader-header">
                                <div className="book-info">
                                    <h2>{selectedBook.title}</h2>
                                    {selectedBook.description && (
                                        <p className="book-description">{selectedBook.description}</p>
                                    )}
                                </div>
                                <div className="chapter-selector">
                                    <button
                                        onClick={prevChapter}
                                        disabled={selectedChapter === 0}
                                        className="chapter-nav-btn"
                                        title="Предыдущая глава"
                                    >
                                        ←
                                    </button>
                                    <div className="chapter-info">
                                        <span className="chapter-label">Глава</span>
                                        <select
                                            value={selectedChapter}
                                            onChange={(e) => handleChapterSelect(parseInt(e.target.value))}
                                            className="chapter-select"
                                        >
                                            {selectedBook.chapters.map((_, index) => (
                                                <option key={index} value={index}>
                                                    {index + 1}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="total-chapters">/{selectedBook.chapters.length}</span>
                                    </div>
                                    <button
                                        onClick={nextChapter}
                                        disabled={selectedChapter === selectedBook.chapters.length - 1}
                                        className="chapter-nav-btn"
                                        title="Следующая глава"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>

                            <div
                                className="text-content"
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                <div className="chapter-header">
                                    <h3>Глава {selectedChapter + 1}</h3>
                                    {selectedBook.chapters[selectedChapter].description && (
                                        <p className="chapter-description">
                                            {selectedBook.chapters[selectedChapter].description}
                                        </p>
                                    )}
                                </div>
                                <div className="bible-text">
                                    {renderTextWithVerses(selectedBook.chapters[selectedChapter].content)}
                                </div>

                                {/* Навигация внизу страницы */}
                                <div className="bottom-navigation">
                                    <button
                                        onClick={prevChapter}
                                        disabled={selectedChapter === 0}
                                        className="nav-btn large"
                                    >
                                        ← Предыдущая глава
                                    </button>
                                    <button
                                        onClick={nextChapter}
                                        disabled={selectedChapter === selectedBook.chapters.length - 1}
                                        className="nav-btn large"
                                    >
                                        Следующая глава →
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* Плавающая кнопка меню для мобильных */}
            {isMobile && !sidebarOpen && (
                <button className="floating-menu-btn" onClick={toggleSidebar} title="Открыть меню">
                    ☰
                </button>
            )}
        </div>
    );
}

export default App;
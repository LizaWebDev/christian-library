import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Импортируем данные текстов
import { books } from './data/index.js';

function App() {
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [fontSize, setFontSize] = useState(18);
    const [darkMode, setDarkMode] = useState(false);
    const [showVerseNumbers, setShowVerseNumbers] = useState(true);
    const [expandedSections, setExpandedSections] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Определяем мобильное устройство
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768 && !sidebarOpen) {
                setSidebarOpen(true);
            }
            if (window.innerWidth < 768 && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarOpen]);

    // При загрузке устанавливаем первую книгу
    useEffect(() => {
        if (books.length > 0 && !selectedBook) {
            setSelectedBook(books[0]);
            // Автоматически разворачиваем все разделы на десктопе
            if (!isMobile) {
                setExpandedSections({
                    'old-testament': true,
                    'new-testament': true,
                    'marcion-gospel': true,
                    'apostolikon': true,
                    'nag-hammadi': true,
                    'other': true
                });
            }
        }
    }, []);

    const handleBookSelect = useCallback((book) => {
        setSelectedBook(book);
        setSelectedChapter(0);
        if (isMobile) {
            setSidebarOpen(false);
        }
        // Прокрутка к верху страницы
        window.scrollTo(0, 0);
    }, [isMobile]);

    const handleChapterSelect = useCallback((index) => {
        setSelectedChapter(index);
        // Прокрутка к началу главы
        const textContent = document.querySelector('.text-content');
        if (textContent) {
            textContent.scrollTo(0, 0);
        }
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

    const increaseFontSize = useCallback(() => {
        setFontSize(prev => Math.min(prev + 1, 24));
    }, []);

    const decreaseFontSize = useCallback(() => {
        setFontSize(prev => Math.max(prev - 1, 14));
    }, []);

    const toggleDarkMode = useCallback(() => {
        setDarkMode(prev => !prev);
    }, []);

    const toggleVerseNumbers = useCallback(() => {
        setShowVerseNumbers(prev => !prev);
    }, []);

    const toggleSection = useCallback((section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }, []);

    // Функция для рендеринга текста с номерами стихов
    const renderTextWithVerses = useCallback((content) => {
        return content.map((verse, index) => (
            <div key={index} className="verse-container">
                {showVerseNumbers && (
                    <span className="verse-number">
            {index + 1}
          </span>
                )}
                <span className="verse-text">{verse}</span>
            </div>
        ));
    }, [showVerseNumbers]);

    // Группируем книги по категориям
    const booksByCategory = {
        'old-testament': books.filter(book => book.category === 'old-testament'),
        'new-testament': books.filter(book => book.category === 'new-testament'),
        'marcion-gospel': books.filter(book => book.category === 'marcion-gospel'),
        'apostolikon': books.filter(book => book.category === 'apostolikon'),
        'nag-hammadi': books.filter(book => book.category === 'nag-hammadi'),
        'other': books.filter(book => book.category === 'other')
    };

    const categoryTitles = {
        'old-testament': 'Ветхий Завет',
        'new-testament': 'Новый Завет',
        'marcion-gospel': 'Евангелие Господне (Маркиона)',
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
                    {sidebarOpen ? '✕' : '☰'}
                    <span className="menu-text">{sidebarOpen ? 'Закрыть' : 'Меню'}</span>
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
                    <button onClick={toggleDarkMode} title="Ночной режим">
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </header>

            <div className="main-content">
                {/* Overlay для мобильных устройств */}
                {isMobile && sidebarOpen && (
                    <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
                )}

                <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-content">
                        <h2>Книги</h2>
                        <div className="book-search">
                            <input
                                type="text"
                                placeholder="Поиск книги..."
                                className="search-input"
                            />
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
                    {selectedBook ? (
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
                    ) : (
                        <div className="welcome-message">
                            <h2>Добро пожаловать в библиотеку христианских текстов</h2>
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
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Плавающая кнопка меню для мобильных */}
            {isMobile && !sidebarOpen && (
                <button className="floating-menu-btn" onClick={toggleSidebar}>
                    ☰
                </button>
            )}
        </div>
    );
}

export default App;
import React, { useState, useEffect } from 'react';
import './App.css';

// Импортируем данные текстов
import { books } from './data/index';

function App() {
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [fontSize, setFontSize] = useState(18);
    const [darkMode, setDarkMode] = useState(false);
    const [showVerseNumbers, setShowVerseNumbers] = useState(true);
    const [expandedSections, setExpandedSections] = useState({
        'old-testament': true,
        'new-testament': true,
        'marcion-gospel': true,
        'apostolikon': true,
        'nag-hammadi': true,
        'other': true
    });

    // При загрузке устанавливаем первую книгу
    useEffect(() => {
        if (books.length > 0) {
            setSelectedBook(books[0]);
        }
    }, []);

    const handleBookSelect = (book) => {
        setSelectedBook(book);
        setSelectedChapter(0);
    };

    const handleChapterSelect = (index) => {
        setSelectedChapter(index);
    };

    const nextChapter = () => {
        if (selectedBook && selectedChapter < selectedBook.chapters.length - 1) {
            setSelectedChapter(selectedChapter + 1);
        }
    };

    const prevChapter = () => {
        if (selectedBook && selectedChapter > 0) {
            setSelectedChapter(selectedChapter - 1);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const increaseFontSize = () => {
        setFontSize(prev => Math.min(prev + 1, 24));
    };

    const decreaseFontSize = () => {
        setFontSize(prev => Math.max(prev - 1, 14));
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleVerseNumbers = () => {
        setShowVerseNumbers(!showVerseNumbers);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Функция для рендеринга текста с номерами стихов
    const renderTextWithVerses = (content) => {
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
    };

    // Группируем книги по категориям
    const oldTestamentBooks = books.filter(book => book.category === 'old-testament');
    const newTestamentBooks = books.filter(book => book.category === 'new-testament');
    const marcionGospelBooks = books.filter(book => book.category === 'marcion-gospel');
    const apostolikonBooks = books.filter(book => book.category === 'apostolikon');
    const nagHammadiBooks = books.filter(book => book.category === 'nag-hammadi');
    const otherBooks = books.filter(book => book.category === 'other');

    return (
        <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
            <header className="app-header">
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    ☰
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
                {sidebarOpen && (
                    <aside className="sidebar">
                        <h2>Книги</h2>
                        <div className="book-categories">

                            {/* Ветхий Завет */}
                            <div className="category-section">
                                <h3 onClick={() => toggleSection('old-testament')} className="category-header">
                                    <span className="collapse-icon">{expandedSections['old-testament'] ? '▼' : '►'}</span>
                                    Ветхий Завет
                                </h3>
                                {expandedSections['old-testament'] && oldTestamentBooks.map(book => (
                                    <div
                                        key={book.id}
                                        className={`book-item ${selectedBook?.id === book.id ? 'selected' : ''}`}
                                        onClick={() => handleBookSelect(book)}
                                    >
                                        {book.title}
                                    </div>
                                ))}
                            </div>

                            {/* Новый Завет */}
                            <div className="category-section">
                                <h3 onClick={() => toggleSection('new-testament')} className="category-header">
                                    <span className="collapse-icon">{expandedSections['new-testament'] ? '▼' : '►'}</span>
                                    Новый Завет
                                </h3>
                                {expandedSections['new-testament'] && newTestamentBooks.map(book => (
                                    <div
                                        key={book.id}
                                        className={`book-item ${selectedBook?.id === book.id ? 'selected' : ''}`}
                                        onClick={() => handleBookSelect(book)}
                                    >
                                        {book.title}
                                    </div>
                                ))}
                            </div>

                            {/* Евангелие Господне (Маркиона) */}
                            <div className="category-section">
                                <h3 onClick={() => toggleSection('marcion-gospel')} className="category-header marcion-gospel-header">
                                    <span className="collapse-icon">{expandedSections['marcion-gospel'] ? '▼' : '►'}</span>
                                    Евангелие Господне (Маркиона)
                                </h3>
                                {expandedSections['marcion-gospel'] && marcionGospelBooks.map(book => (
                                    <div
                                        key={book.id}
                                        className={`book-item ${selectedBook?.id === book.id ? 'selected' : ''}`}
                                        data-category="marcion-gospel"
                                        onClick={() => handleBookSelect(book)}
                                    >
                                        {book.title}
                                    </div>
                                ))}
                            </div>

                            {/* Апостоликон Маркиона */}
                            <div className="category-section">
                                <h3 onClick={() => toggleSection('apostolikon')} className="category-header apostolikon-header">
                                    <span className="collapse-icon">{expandedSections['apostolikon'] ? '▼' : '►'}</span>
                                    Апостоликон Маркиона
                                </h3>
                                {expandedSections['apostolikon'] && apostolikonBooks.map(book => (
                                    <div
                                        key={book.id}
                                        className={`book-item ${selectedBook?.id === book.id ? 'selected' : ''}`}
                                        data-category="apostolikon"
                                        onClick={() => handleBookSelect(book)}
                                    >
                                        {book.title}
                                    </div>
                                ))}
                            </div>

                            {/* Апокрифы Наг-Хаммади */}
                            <div className="category-section">
                                <h3 onClick={() => toggleSection('nag-hammadi')} className="category-header">
                                    <span className="collapse-icon">{expandedSections['nag-hammadi'] ? '▼' : '►'}</span>
                                    Апокрифы Наг-Хаммади
                                </h3>
                                {expandedSections['nag-hammadi'] && nagHammadiBooks.map(book => (
                                    <div
                                        key={book.id}
                                        className={`book-item ${selectedBook?.id === book.id ? 'selected' : ''}`}
                                        onClick={() => handleBookSelect(book)}
                                    >
                                        {book.title}
                                    </div>
                                ))}
                            </div>

                            {/* Другие тексты */}
                            <div className="category-section">
                                <h3 onClick={() => toggleSection('other')} className="category-header">
                                    <span className="collapse-icon">{expandedSections['other'] ? '▼' : '►'}</span>
                                    Другие тексты
                                </h3>
                                {expandedSections['other'] && otherBooks.map(book => (
                                    <div
                                        key={book.id}
                                        className={`book-item ${selectedBook?.id === book.id ? 'selected' : ''}`}
                                        onClick={() => handleBookSelect(book)}
                                    >
                                        {book.title}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </aside>
                )}

                <main className="reader">
                    {selectedBook ? (
                        <>
                            <div className="reader-header">
                                <div>
                                    <h2>{selectedBook.title}</h2>
                                    {selectedBook.description && (
                                        <p className="book-description">{selectedBook.description}</p>
                                    )}
                                </div>
                                <div className="chapter-selector">
                                    <button onClick={prevChapter} disabled={selectedChapter === 0}>
                                        ← Предыдущая
                                    </button>
                                    <select
                                        value={selectedChapter}
                                        onChange={(e) => handleChapterSelect(parseInt(e.target.value))}
                                    >
                                        {selectedBook.chapters.map((_, index) => (
                                            <option key={index} value={index}>
                                                Глава {index + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={nextChapter}
                                        disabled={selectedChapter === selectedBook.chapters.length - 1}
                                    >
                                        Следующая →
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
                            </div>
                        </>
                    ) : (
                        <div className="welcome-message">
                            <h2>Добро пожаловать в библиотеку христианских текстов</h2>
                            <p>Выберите книгу из левого меню для начала чтения.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;
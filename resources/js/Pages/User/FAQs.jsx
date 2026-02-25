import AppLayout from '@/Layouts/AppLayout';
import { useState } from 'react';

export default function FAQs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [openItems, setOpenItems] = useState({});

    // FAQ Categories
    const categories = [
        { id: 'all', name: 'All Questions', count: 12 },
        { id: 'application', name: 'Application Process', count: 4 },
        { id: 'requirements', name: 'Requirements', count: 3 },
        { id: 'payment', name: 'Payment', count: 2 },
        { id: 'interview', name: 'Interview & Assessment', count: 2 },
        { id: 'release', name: 'COC Release', count: 1 }
    ];

    // FAQ Data
    const faqs = [
        {
            id: 1,
            category: 'application',
            question: 'How do I apply for a Certificate of Competency (COC)?',
            answer: 'To apply for a COC, you need to visit the COC Application Process page and complete the online application form. After submission, you will receive a confirmation email with your application reference number. You can track your application status through the Application Status page.'
        },
        {
            id: 2,
            category: 'application',
            question: 'How long does the COC application process take?',
            answer: 'The entire COC application process typically takes 7-10 business days from submission of complete requirements. This includes document verification (3-5 days), interview scheduling (1 day), and final approval (2-3 days).'
        },
        {
            id: 3,
            category: 'application',
            question: 'Can I save my application and continue later?',
            answer: 'Yes, the application form allows you to save your progress and continue later. You can access your draft application from your dashboard under "My Applications".'
        },
        {
            id: 4,
            category: 'application',
            question: 'How do I track my application status?',
            answer: 'You can track your application status by visiting the Application Status page and entering your application reference number. You can also view all your applications in one place on your dashboard.'
        },
        {
            id: 5,
            category: 'requirements',
            question: 'What are the requirements for COC application?',
            answer: 'The requirements include: Completed application form, Valid government ID, Birth certificate, Proof of payment for application fee, 2×2 ID pictures (2 copies), Barangay clearance, and Certificate of good moral character.'
        },
        {
            id: 6,
            category: 'requirements',
            question: 'Do I need to submit original documents?',
            answer: 'For online applications, you may submit scanned copies of your documents. However, you will need to present the original documents during your scheduled interview for verification.'
        },
        {
            id: 7,
            category: 'requirements',
            question: 'How do I know if my documents are complete?',
            answer: 'Once you submit your application, our team will review your documents. You will receive a notification if any documents are missing or need to be resubmitted. You can also check the status of your document verification on the Application Status page.'
        },
        {
            id: 8,
            category: 'payment',
            question: 'How much is the COC application fee?',
            answer: 'The COC application fee is PHP 500.00. This covers processing, verification, and issuance of the Certificate of Competency.'
        },
        {
            id: 9,
            category: 'payment',
            question: 'What payment methods are accepted?',
            answer: 'We accept the following payment methods: Online banking (all major banks), GCash, PayMaya, Credit/Debit cards (Visa, Mastercard), and Over-the-counter payments at partner banks.'
        },
        {
            id: 10,
            category: 'interview',
            question: 'How will I be scheduled for an interview?',
            answer: 'Once your documents are verified, you will receive an email notification with a link to schedule your interview. You can choose from available time slots that work best for you.'
        },
        {
            id: 11,
            category: 'interview',
            question: 'Is the interview conducted online or in person?',
            answer: 'Interviews are conducted online via video conference. You will receive a meeting link via email after scheduling your interview. Make sure you have a stable internet connection and a working camera.'
        },
        {
            id: 12,
            category: 'release',
            question: 'How do I claim my COC once approved?',
            answer: 'Once your application is approved, you will receive a notification that your COC is ready for claiming. You can claim it personally at our office or request for delivery (shipping fee applies). Bring a valid ID for verification.'
        }
    ];

    // Filter FAQs based on search and category
    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // Toggle FAQ item
    const toggleItem = (id) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Get category name by id
    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    };

    // Get category color
    const getCategoryColor = (categoryId) => {
        const colors = {
            'application': 'bg-blue-100 text-blue-700 border-blue-200',
            'requirements': 'bg-purple-100 text-purple-700 border-purple-200',
            'payment': 'bg-green-100 text-green-700 border-green-200',
            'interview': 'bg-orange-100 text-orange-700 border-orange-200',
            'release': 'bg-indigo-100 text-indigo-700 border-indigo-200'
        };
        return colors[categoryId] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    return (
        <AppLayout title="FAQs">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
                <p className="text-gray-600">Find answers to common questions about COC application</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for questions or keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                        {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'} found
                    </p>
                </div>
            </div>

            {/* Categories and FAQs */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Categories Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4">
                        <h2 className="font-semibold text-gray-900 mb-3 px-2">Categories</h2>
                        <div className="space-y-1">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                                        activeCategory === category.id
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <span>{category.name}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        activeCategory === category.id
                                            ? 'bg-white/20 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {category.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQ Items */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-lg divide-y divide-gray-200">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq) => (
                                <div key={faq.id} className="p-6">
                                    <button
                                        onClick={() => toggleItem(faq.id)}
                                        className="w-full text-left flex items-start justify-between group"
                                    >
                                        <div className="flex-1 pr-8">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(faq.category)}`}>
                                                    {getCategoryName(faq.category)}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-all">
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <span className={`text-2xl transform transition-all ${
                                            openItems[faq.id] ? 'rotate-180 text-blue-600' : 'text-gray-400'
                                        }`}>
                                            ↓
                                        </span>
                                    </button>
                                    
                                    {openItems[faq.id] && (
                                        <div className="mt-4 pl-0 border-t-2 border-gray-100 pt-4">
                                            <p className="text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4 text-gray-300">🔍</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                                <p className="text-gray-600 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
                                <button 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setActiveCategory('all');
                                    }}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Still Have Questions Section */}
            <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
                    <p className="text-blue-100 mb-6">
                        Can't find the answer you're looking for? Please reach out to our support team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all font-semibold">
                            Contact Support
                        </button>
                        <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all font-semibold">
                            Schedule a Call
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Help Links */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mx-auto mb-3">
                        📞
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                    <p className="text-sm text-gray-600 mb-2">Monday - Friday, 8AM - 5PM</p>
                    <p className="text-blue-600 font-semibold">(02) 1234-5678</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl mx-auto mb-3">
                        ✉️
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                    <p className="text-sm text-gray-600 mb-2">We'll respond within 24 hours</p>
                    <p className="text-green-600 font-semibold">support@yourapp.com</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl mx-auto mb-3">
                        💬
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                    <p className="text-sm text-gray-600 mb-2">Available 24/7 for urgent concerns</p>
                    <button className="text-purple-600 font-semibold hover:text-purple-800">
                        Start Chat →
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
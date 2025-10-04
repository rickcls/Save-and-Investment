// Financial Planning Application JavaScript
class FinancialApp {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.initializeCalculators();
        this.createDCAChart();
        this.setupProgressBar();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupChecklist();
        this.setupCollapsibleSections();
        this.setupInteractiveAllocation();
        this.setupAnimatedCounters();
        this.setupTargetCards();
        this.setupGoalCalculator();
        this.animateOnLoad();
    }

    initializeElements() {
        // Navigation elements
        this.progressBar = document.querySelector('.progress-fill');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.navLinksContainer = document.querySelector('.nav-links');

        // Calculator elements
        this.monthlyExpensesInput = document.getElementById('monthlyExpenses');
        this.monthlyInvestmentInput = document.getElementById('monthlyInvestment');
        this.investmentPeriodInput = document.getElementById('investmentPeriod');

        // Result elements
        this.annualExpensesSpan = document.getElementById('annualExpenses');
        this.retirementFundSpan = document.getElementById('retirementFund');
        this.monthlyWithdrawalSpan = document.getElementById('monthlyWithdrawal');

        // Investment result elements
        this.conservativeResult = document.getElementById('conservative-result');
        this.conservativeGain = document.getElementById('conservative-gain');
        this.moderateResult = document.getElementById('moderate-result');
        this.moderateGain = document.getElementById('moderate-gain');
        this.optimisticResult = document.getElementById('optimistic-result');
        this.optimisticGain = document.getElementById('optimistic-gain');

        // Other elements
        this.scrollDownBtn = document.querySelector('.scroll-down-btn');
        this.actionBtn = document.querySelector('.action-btn');
        this.checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        this.targetCards = document.querySelectorAll('.target-card');
    }

    setupEventListeners() {
        // Scroll event for progress bar and active navigation
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateProgressBar();
                    this.updateActiveNavLink();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Calculator input events
        if (this.monthlyExpensesInput) {
            this.monthlyExpensesInput.addEventListener('input', () => this.calculateRetirement());
        }
        
        if (this.monthlyInvestmentInput && this.investmentPeriodInput) {
            this.monthlyInvestmentInput.addEventListener('input', () => this.calculateInvestmentReturns());
            this.investmentPeriodInput.addEventListener('input', () => this.calculateInvestmentReturns());
        }

        // Button click events
        if (this.scrollDownBtn) {
            this.scrollDownBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = this.scrollDownBtn.getAttribute('data-target');
                this.scrollToSection(targetId);
            });
        }

        if (this.actionBtn) {
            this.actionBtn.addEventListener('click', () => {
                this.actionBtn.textContent = 'Great! Keep going! 🎉';
                setTimeout(() => {
                    this.actionBtn.textContent = 'I\'m Ready to Start Investing';
                }, 2000);
            });
        }

        // Window resize event
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.navLinksContainer) {
                this.navLinksContainer.classList.remove('mobile-open');
            }
        });
    }

    initializeCalculators() {
        this.calculateRetirement();
        this.calculateInvestmentReturns();
    }

    calculateRetirement() {
        const monthlyExpenses = parseFloat(this.monthlyExpensesInput?.value) || 20000;
        const annualExpenses = monthlyExpenses * 12;
        const retirementFund = annualExpenses * 25;
        const monthlyWithdrawal = retirementFund * 0.04 / 12;

        if (this.annualExpensesSpan) {
            this.annualExpensesSpan.textContent = `HK$${this.formatNumber(annualExpenses)}`;
        }
        if (this.retirementFundSpan) {
            this.retirementFundSpan.textContent = `HK$${this.formatNumber(retirementFund)}`;
        }
        if (this.monthlyWithdrawalSpan) {
            this.monthlyWithdrawalSpan.textContent = `HK$${this.formatNumber(monthlyWithdrawal)}`;
        }
    }

    calculateInvestmentReturns() {
        const monthlyInvestment = parseFloat(this.monthlyInvestmentInput?.value) || 1000;
        const years = parseFloat(this.investmentPeriodInput?.value) || 30;
        const months = years * 12;

        // Calculate for different return rates
        const rates = {
            conservative: 0.03,
            moderate: 0.06,
            optimistic: 0.10
        };

        const results = {};
        Object.keys(rates).forEach(scenario => {
            const monthlyRate = rates[scenario] / 12;
            const totalInvested = monthlyInvestment * months;
            
            // Future value of annuity formula
            let finalValue;
            if (monthlyRate === 0) {
                finalValue = totalInvested;
            } else {
                finalValue = monthlyInvestment * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
            }
            
            const totalGain = finalValue - totalInvested;
            
            results[scenario] = { finalValue, totalGain, totalInvested };
        });

        // Update UI
        this.updateInvestmentResults('conservative', results.conservative);
        this.updateInvestmentResults('moderate', results.moderate);
        this.updateInvestmentResults('optimistic', results.optimistic);
    }

    updateInvestmentResults(scenario, data) {
        const resultElement = document.getElementById(`${scenario}-result`);
        const gainElement = document.getElementById(`${scenario}-gain`);
        
        if (resultElement) {
            resultElement.textContent = `HK$${this.formatNumber(data.finalValue)}`;
        }
        if (gainElement) {
            gainElement.textContent = `+HK$${this.formatNumber(data.totalGain)}`;
        }
    }

    createDCAChart() {
        const canvas = document.getElementById('dcaChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // DCA example data
        const dcaData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Share Price (HK$)',
                    data: [100, 90, 110, 85, 95, 105],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    yAxisID: 'y',
                    type: 'line',
                    fill: true
                },
                {
                    label: 'Shares Bought',
                    data: [10, 11.11, 9.09, 11.76, 10.53, 9.52],
                    backgroundColor: '#FFC185',
                    borderColor: '#FFC185',
                    yAxisID: 'y1',
                    type: 'bar'
                }
            ]
        };

        const config = {
            type: 'line',
            data: dcaData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            afterBody: function(context) {
                                const index = context[0].dataIndex;
                                const sharePrice = dcaData.datasets[0].data[index];
                                const sharesBought = dcaData.datasets[1].data[index];
                                return `Investment: HK$1,000\nAvg Cost: HK$${sharePrice}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Share Price (HK$)'
                        },
                        min: 80,
                        max: 120
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Shares Bought'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        min: 8,
                        max: 14
                    }
                }
            }
        };

        this.dcaChart = new Chart(ctx, config);
    }

    setupProgressBar() {
        this.updateProgressBar();
    }

    updateProgressBar() {
        if (!this.progressBar) return;
        
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        this.progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollToSection(targetId);
                
                // Close mobile menu if open
                if (window.innerWidth <= 768 && this.navLinksContainer) {
                    this.navLinksContainer.classList.remove('mobile-open');
                }
            });
        });

        // Setup button navigation
        const navigationButtons = document.querySelectorAll('[data-target]');
        navigationButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('data-target');
                this.scrollToSection(targetId);
            });
        });

        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const scrollPosition = window.pageYOffset + 150;
        
        this.sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    setupMobileMenu() {
        if (this.mobileMenuToggle && this.navLinksContainer) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.navLinksContainer.classList.toggle('mobile-open');
            });

            // Add mobile menu styles
            this.addMobileMenuStyles();
        }
    }

    addMobileMenuStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .nav-links {
                    position: fixed;
                    top: 70px;
                    left: 0;
                    right: 0;
                    background: var(--color-surface);
                    backdrop-filter: blur(15px);
                    flex-direction: column;
                    padding: var(--space-20);
                    gap: var(--space-16);
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    border-bottom: 1px solid var(--color-border);
                    box-shadow: var(--shadow-lg);
                }
                
                .nav-links.mobile-open {
                    display: flex;
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }
                
                .nav-link {
                    padding: var(--space-12) var(--space-16);
                    border-radius: var(--radius-base);
                    text-align: center;
                    border: 1px solid transparent;
                    background: var(--color-bg-1);
                }
                
                .nav-link:hover,
                .nav-link.active {
                    border-color: var(--color-primary);
                    background: var(--color-bg-3);
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupChecklist() {
        if (this.checkboxes.length === 0) return;

        this.checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                this.updateChecklistProgress();
                this.animateCheckboxChange(checkbox);
            });
        });

        this.updateChecklistProgress();
    }

    updateChecklistProgress() {
        const checkedCount = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
        const totalCount = this.checkboxes.length;
        const progressPercent = Math.round((checkedCount / totalCount) * 100);

        // Update any progress indicators
        const progressElements = document.querySelectorAll('.checklist-progress');
        progressElements.forEach(element => {
            element.textContent = `${progressPercent}% Complete`;
        });

        // Change button text based on progress
        if (this.actionBtn) {
            if (checkedCount === totalCount) {
                this.actionBtn.textContent = 'All Done! Ready to Invest 🎉';
                this.actionBtn.classList.add('btn--success');
            } else if (checkedCount > totalCount / 2) {
                this.actionBtn.textContent = `Great Progress! (${checkedCount}/${totalCount})`;
                this.actionBtn.classList.remove('btn--success');
            } else if (checkedCount > 0) {
                this.actionBtn.textContent = `Keep Going! (${checkedCount}/${totalCount})`;
                this.actionBtn.classList.remove('btn--success');
            } else {
                this.actionBtn.textContent = 'I\'m Ready to Start Investing';
                this.actionBtn.classList.remove('btn--success');
            }
        }
    }

    animateCheckboxChange(checkbox) {
        const listItem = checkbox.closest('.checklist-item');
        if (checkbox.checked) {
            listItem.style.background = 'var(--color-bg-3)';
            listItem.style.borderLeft = '4px solid var(--color-success)';
            listItem.style.transform = 'scale(1.02)';
            setTimeout(() => {
                listItem.style.transform = 'scale(1)';
            }, 150);
        } else {
            listItem.style.background = 'var(--color-bg-1)';
            listItem.style.borderLeft = 'none';
        }
    }

    animateOnLoad() {
        // Fade in the page
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);

        // Animate title elements
        const titleElements = document.querySelectorAll('.main-title, .subtitle, .highlight-item');
        titleElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 150 + 300);
        });

        // Setup intersection observer for other elements
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.part-card, .target-card, .profile-card, .insight-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    formatNumber(number) {
        return new Intl.NumberFormat('en-HK').format(Math.round(number));
    }

    // Collapsible Sections
    setupCollapsibleSections() {
        const collapsibleHeaders = document.querySelectorAll('.collapsible-header, .section-header-interactive');
        
        collapsibleHeaders.forEach(header => {
            const collapseBtn = header.querySelector('.collapse-btn');
            if (!collapseBtn) return;
            
            collapseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const section = header.closest('.collapsible-section');
                const icon = collapseBtn.querySelector('.collapse-icon');
                const content = section.querySelector('.category-content, .comparison-intro, .etf-categories, .example-comparison, .allocation-by-age, .interactive-allocation');
                
                if (!content) return;
                
                section.classList.toggle('collapsed');
                
                if (section.classList.contains('collapsed')) {
                    icon.textContent = '+';
                    content.style.maxHeight = '0px';
                    content.style.opacity = '0';
                } else {
                    icon.textContent = '−';
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.opacity = '1';
                    // Reset max-height after transition
                    setTimeout(() => {
                        if (!section.classList.contains('collapsed')) {
                            content.style.maxHeight = 'none';
                        }
                    }, 300);
                }
            });
        });
    }

    // Interactive Asset Allocation Slider
    setupInteractiveAllocation() {
        const ageSlider = document.getElementById('ageSlider');
        const currentAge = document.getElementById('currentAge');
        const stocksPercent = document.getElementById('stocksPercent');
        const bondsPercent = document.getElementById('bondsPercent');
        const allocationExplanation = document.getElementById('allocationExplanation');
        const stocksBar = document.querySelector('.stocks-bar');
        const bondsBar = document.querySelector('.bonds-bar');
        
        if (!ageSlider) return;
        
        const updateAllocation = (age) => {
            // Calculate allocation based on age (simple formula: stocks = 100 - age, adjusted)
            let stocksPct, bondsPct;
            
            if (age <= 30) {
                stocksPct = 85;
                bondsPct = 15;
            } else if (age <= 40) {
                stocksPct = 75;
                bondsPct = 25;
            } else if (age <= 50) {
                stocksPct = 65;
                bondsPct = 35;
            } else if (age <= 60) {
                stocksPct = 55;
                bondsPct = 45;
            } else {
                stocksPct = 45;
                bondsPct = 55;
            }
            
            // Update display
            currentAge.textContent = age;
            stocksPercent.textContent = `${stocksPct}%`;
            bondsPercent.textContent = `${bondsPct}%`;
            
            // Update bars
            if (stocksBar) stocksBar.style.width = `${stocksPct}%`;
            if (bondsBar) bondsBar.style.width = `${bondsPct}%`;
            
            // Update explanation
            let explanation = '';
            if (age <= 30) {
                explanation = `At age ${age}, you're young! Maximize growth with ${stocksPct}% in stocks. Time is on your side to ride out volatility.`;
            } else if (age <= 40) {
                explanation = `At age ${age}, maintain strong stock allocation (${stocksPct}%) for continued growth while building some stability.`;
            } else if (age <= 50) {
                explanation = `At age ${age}, balance growth and stability with ${stocksPct}% stocks and ${bondsPct}% bonds/cash.`;
            } else if (age <= 60) {
                explanation = `At age ${age}, approaching retirement. Shift toward stability with ${bondsPct}% in bonds/cash.`;
            } else {
                explanation = `At age ${age}, prioritize capital preservation with ${bondsPct}% in bonds/cash while maintaining ${stocksPct}% stocks for growth.`;
            }
            
            if (allocationExplanation) {
                allocationExplanation.textContent = explanation;
            }
        };
        
        // Initial update
        updateAllocation(parseInt(ageSlider.value));
        
        // Update on slider change
        ageSlider.addEventListener('input', (e) => {
            updateAllocation(parseInt(e.target.value));
        });
    }

    // Animated Counters
    setupAnimatedCounters() {
        const counters = document.querySelectorAll('.highlight-number');
        const animateCounter = (counter) => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const text = counter.textContent;
            const hasX = text.includes('x');
            const hasPercent = text.includes('%');
            const hasM = text.includes('M');
            const hasDollar = text.includes('$');
            
            let current = 0;
            const increment = target / 50; // 50 steps
            const duration = 1500; // 1.5 seconds
            const stepTime = duration / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                let displayValue = '';
                if (hasDollar) {
                    displayValue = `HK$${current.toFixed(1)}M`;
                } else if (hasX) {
                    displayValue = `${Math.round(current)}x`;
                } else if (hasPercent) {
                    displayValue = `${Math.round(current)}%`;
                } else {
                    displayValue = current.toFixed(1);
                }
                
                counter.textContent = displayValue;
            }, stepTime);
        };
        
        // Animate when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // Setup Interactive Target Cards
    setupTargetCards() {
        if (this.targetCards.length === 0 || !this.monthlyExpensesInput) return;

        // Define monthly expenses for each lifestyle
        const lifestyleExpenses = {
            'Basic Lifestyle': 11000,
            'Moderate Lifestyle': 15000,
            'Comfortable Lifestyle': 27000,
            'Affluent Lifestyle': 39000
        };

        this.targetCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                // Get the lifestyle type from the card's h4
                const lifestyleType = card.querySelector('h4')?.textContent;
                const monthlyExpense = lifestyleExpenses[lifestyleType];

                if (monthlyExpense && this.monthlyExpensesInput) {
                    // Update the calculator input
                    this.monthlyExpensesInput.value = monthlyExpense;
                    
                    // Trigger calculation
                    this.calculateRetirement();

                    // Visual feedback - remove 'selected' class from all cards
                    this.targetCards.forEach(c => c.classList.remove('selected'));
                    
                    // Add 'selected' class to clicked card
                    card.classList.add('selected');

                    // Smooth scroll to calculator
                    const calculator = document.querySelector('.four-percent-rule');
                    if (calculator) {
                        calculator.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // Add animation to show it's working
                    this.monthlyExpensesInput.style.transform = 'scale(1.05)';
                    this.monthlyExpensesInput.style.transition = 'transform 0.2s';
                    setTimeout(() => {
                        this.monthlyExpensesInput.style.transform = 'scale(1)';
                    }, 200);
                }
            });
        });
    }

    // Setup Goal Calculator
    setupGoalCalculator() {
        const goalNameInput = document.getElementById('goalName');
        const goalAmountInput = document.getElementById('goalAmount');
        const goalYearsInput = document.getElementById('goalYears');
        const timeRuleCards = document.querySelectorAll('.time-rule-card');

        if (!goalAmountInput || !goalYearsInput) return;

        const updateGoalRecommendation = () => {
            const goalName = goalNameInput?.value || 'Your Goal';
            const amount = parseFloat(goalAmountInput.value) || 100000;
            const years = parseFloat(goalYearsInput.value) || 3;
            const months = years * 12;

            // Calculate monthly savings needed (simple division, no interest)
            const monthlySaving = amount / months;

            // Determine recommendation based on time frame
            let vehicle, reason, vehicleColor;
            
            if (years < 2) {
                vehicle = 'High-Yield Savings Account';
                reason = 'For goals under 2 years, keep money in cash to avoid market volatility. Your capital is guaranteed.';
                vehicleColor = '--color-info';
            } else if (years < 3) {
                vehicle = 'Cash Savings Account';
                reason = 'For 2-3 year goals, cash remains safest. Market fluctuations could hurt your goal if you need the money soon.';
                vehicleColor = '--color-info';
            } else if (years < 5) {
                vehicle = 'Bond Funds';
                reason = 'For 3-5 year goals, bonds provide better returns than cash while remaining relatively safe. They have time to recover from short-term dips.';
                vehicleColor = '--color-success';
            } else {
                vehicle = 'Balanced Portfolio (Stocks + Bonds)';
                reason = 'For 5+ year goals, use a mix of stocks and bonds. You have enough time to ride out market volatility and benefit from higher stock returns.';
                vehicleColor = '--color-warning';
            }

            // Update UI
            document.getElementById('recGoalName').textContent = goalName;
            document.getElementById('recAmount').textContent = `HK$${this.formatNumber(amount)}`;
            document.getElementById('recTimeFrame').textContent = `${years} year${years !== 1 ? 's' : ''}`;
            document.getElementById('recMonthlySaving').textContent = `HK$${this.formatNumber(monthlySaving)}`;
            document.getElementById('recVehicle').textContent = vehicle;
            document.getElementById('recReason').textContent = reason;

            // Highlight the corresponding time rule card
            timeRuleCards.forEach(card => {
                const minYears = parseFloat(card.getAttribute('data-min-years'));
                const maxYears = parseFloat(card.getAttribute('data-max-years'));
                
                if (years >= minYears && years < maxYears) {
                    card.classList.add('active-rule');
                } else {
                    card.classList.remove('active-rule');
                }
            });

            // Animate the recommendation box
            const recBox = document.getElementById('goalRecommendation');
            recBox.style.transform = 'scale(1.02)';
            setTimeout(() => {
                recBox.style.transform = 'scale(1)';
            }, 200);
        };

        // Initial calculation
        updateGoalRecommendation();

        // Add event listeners
        if (goalNameInput) {
            goalNameInput.addEventListener('input', updateGoalRecommendation);
        }
        goalAmountInput.addEventListener('input', updateGoalRecommendation);
        goalYearsInput.addEventListener('input', updateGoalRecommendation);
    }
}

// Utility functions
function addSuccessButtonStyle() {
    const style = document.createElement('style');
    style.textContent = `
        .btn--success {
            background: var(--color-success) !important;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addSuccessButtonStyle();
    new FinancialApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Refresh calculations when page becomes visible again
        const app = window.financialApp;
        if (app) {
            app.calculateRetirement();
            app.calculateInvestmentReturns();
        }
    }
});

// Export for potential external use
window.FinancialApp = FinancialApp;

class TicketTimer {
    constructor(duration, onTick, onComplete) {
        this.duration = duration;
        this.timeLeft = duration;
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.interval = null;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.interval = setInterval(() => {
            this.timeLeft--;
            this.onTick(this.timeLeft);
            
            if (this.timeLeft <= 0) {
                this.stop();
                this.onComplete();
            }
        }, 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            this.isRunning = false;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Questions with multiple choice options and correct answers
const questions = {
    p1: [
        {
            question: "CRITICAL: The main database server is down and users cannot access the application. What is your FIRST immediate action?",
            options: [
                "Check server logs and restart the database service",
                "Notify all stakeholders via email about the outage",
                "Switch to backup database server immediately",
                "Run a full system diagnostic to find the root cause"
            ],
            correct: 2,
            explanation: "In a critical outage, the first priority is restoring service. Switching to backup servers provides immediate relief while investigation continues."
        },
        {
            question: "SECURITY BREACH: Unauthorized access detected in admin panel. What should be your immediate response?",
            options: [
                "Change all admin passwords and enable 2FA",
                "Disconnect affected systems from network immediately",
                "Document the breach for compliance reporting",
                "Run antivirus scans on all servers"
            ],
            correct: 1,
            explanation: "In a security breach, immediate isolation prevents further damage. Disconnecting systems stops the attack while you assess the situation."
        },
        {
            question: "CRITICAL: Payment processing system failing, no transactions possible. What's the priority action?",
            options: [
                "Contact payment gateway support",
                "Activate backup payment processor",
                "Notify customers about payment issues",
                "Review recent code deployments"
            ],
            correct: 1,
            explanation: "Business continuity is critical. Activating backup payment systems ensures revenue flow continues while the primary issue is resolved."
        }
    ],
    p2: [
        {
            question: "HIGH PRIORITY: Website loading extremely slowly (30+ seconds). What should you investigate first?",
            options: [
                "Check database query performance",
                "Review server CPU and memory usage",
                "Analyze network connectivity issues",
                "Examine recent code deployments"
            ],
            correct: 1,
            explanation: "Server resource utilization is often the primary cause of slow performance and should be checked first for quick wins."
        },
        {
            question: "MAJOR BUG: Users can't upload files >1MB, but system should support 10MB. Best approach?",
            options: [
                "Increase server memory allocation",
                "Check web server upload limits configuration",
                "Optimize file compression algorithms",
                "Implement file chunking for large uploads"
            ],
            correct: 1,
            explanation: "File upload size limits are typically configured at the web server level (nginx, Apache) and should be checked first."
        },
        {
            question: "HIGH PRIORITY: Email notifications stopped working 2 hours ago. First troubleshooting step?",
            options: [
                "Check email service logs for errors",
                "Restart the email service",
                "Verify SMTP server connectivity",
                "Review email queue status"
            ],
            correct: 0,
            explanation: "Logs provide the most information about what went wrong and when, making them the best starting point for diagnosis."
        }
    ],
    p3: [
        {
            question: "MEDIUM PRIORITY: Search function returns irrelevant results occasionally. How would you investigate?",
            options: [
                "Rebuild the search index completely",
                "Analyze search query patterns and results",
                "Increase search server resources",
                "Update search algorithm parameters"
            ],
            correct: 1,
            explanation: "Understanding the pattern of when irrelevant results occur helps identify the root cause before making changes."
        },
        {
            question: "FEATURE REQUEST: Customers want dark mode. What's the best implementation approach?",
            options: [
                "Create separate dark theme CSS files",
                "Use CSS variables for dynamic theming",
                "Implement theme switching with JavaScript",
                "Redesign the entire UI for dark mode"
            ],
            correct: 1,
            explanation: "CSS variables provide the most maintainable and efficient way to implement theme switching."
        },
        {
            question: "MEDIUM PRIORITY: Mobile app crashes on certain Android devices when accessing profile page. Best debugging approach?",
            options: [
                "Test on all Android device models",
                "Check crash logs for specific error patterns",
                "Rewrite the profile page component",
                "Update the mobile app framework"
            ],
            correct: 1,
            explanation: "Crash logs will show the specific error and stack trace, helping identify the exact cause and affected device characteristics."
        }
    ],
    p4: [
        {
            question: "LOW PRIORITY: Users want better tooltips throughout the application. Best approach?",
            options: [
                "Add tooltips to every UI element",
                "Conduct user research to identify key areas needing help",
                "Copy tooltip patterns from competitors",
                "Implement tooltips using a third-party library"
            ],
            correct: 1,
            explanation: "User research ensures tooltips are added where they're actually needed, improving UX without cluttering the interface."
        },
        {
            question: "DOCUMENTATION: API documentation is outdated. How would you organize the update?",
            options: [
                "Rewrite all documentation from scratch",
                "Set up automated documentation generation",
                "Assign documentation tasks to developers",
                "Hire a technical writer"
            ],
            correct: 1,
            explanation: "Automated documentation generation from code ensures documentation stays current with minimal manual effort."
        },
        {
            question: "MINOR IMPROVEMENT: Loading animations need modernization. Best approach?",
            options: [
                "Use CSS animations instead of GIFs",
                "Research current animation trends and user preferences",
                "Implement complex 3D animations",
                "Remove loading animations entirely"
            ],
            correct: 1,
            explanation: "Research ensures the new animations align with user expectations and current design trends for better UX."
        }
    ]
};

function getRandomQuestion(priority) {
    const priorityQuestions = questions[priority];
    return priorityQuestions[Math.floor(Math.random() * priorityQuestions.length)];
}

function initializeQuestionPage(duration, priority) {
    const timerElement = document.getElementById('timer');
    const submitBtn = document.getElementById('submitBtn');
    const answerOptions = document.querySelectorAll('input[name="answer"]');
    let isSubmitted = false;
    
    // Hide ticket actions initially
    const ticketActions = document.querySelector('.ticket-actions');
    if (ticketActions) {
        ticketActions.style.display = 'none';
    }
    
    const timer = new TicketTimer(
        duration,
        (timeLeft) => {
            timerElement.textContent = timer.formatTime(timeLeft);
            
            // Change color when time is running low (last 25% of time)
            if (timeLeft <= duration * 0.25) {
                timerElement.className = 'timer warning';
            } else {
                timerElement.className = 'timer normal';
            }
        },
        () => {
            // Time's up
            if (!isSubmitted) {
                timerElement.textContent = "Time's Up!";
                timerElement.className = 'timer warning';
                
                // Disable all options
                const currentAnswerOptions = document.querySelectorAll('input[name="answer"]');
                currentAnswerOptions.forEach(option => {
                    option.disabled = true;
                });
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Time Expired';
                
                // Show time up message
                const timeUpDiv = document.createElement('div');
                timeUpDiv.className = 'time-up';
                timeUpDiv.textContent = '⏰ Time has expired! Please try again.';
                document.querySelector('.question-content').insertBefore(timeUpDiv, document.querySelector('.answer-options'));
                
                // Show ticket actions after time expires
                showTicketActions();
            }
        }
    );

    // Initialize timer display
    timerElement.textContent = timer.formatTime(duration);
    timerElement.className = 'timer normal';
    
    // Start the timer
    timer.start();
    
    // Handle form submission
    document.getElementById('ticketForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (isSubmitted) return;
        
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) {
            alert('Please select an answer before submitting.');
            return;
        }
        
        isSubmitted = true;
        timer.stop();
        
        const selectedIndex = parseInt(selectedAnswer.value);
        const currentQuestion = window.currentQuestion;
        const isCorrect = selectedIndex === currentQuestion.correct;
        
        // Show results
        showResults(isCorrect, selectedIndex, currentQuestion);
        
        // Disable further interaction
        const currentAnswerOptions = document.querySelectorAll('input[name="answer"]');
        currentAnswerOptions.forEach(option => {
            option.disabled = true;
        });
        
        submitBtn.textContent = 'Answer Submitted';
        submitBtn.disabled = true;
        
        // Show ticket actions after answering
        showTicketActions();
        
        // Add back to dashboard button after delay
        setTimeout(() => {
            const backBtn = document.createElement('button');
            backBtn.textContent = 'Back to Dashboard';
            backBtn.className = 'btn btn-back';
            backBtn.onclick = () => location.href = 'index.html';
            document.querySelector('.button-group').appendChild(backBtn);
        }, 2000);
    });
}

function showTicketActions() {
    const ticketActions = document.querySelector('.ticket-actions');
    if (ticketActions) {
        ticketActions.style.display = 'block';
        // Add a smooth fade-in effect
        ticketActions.style.opacity = '0';
        ticketActions.style.transition = 'opacity 0.5s ease-in';
        setTimeout(() => {
            ticketActions.style.opacity = '1';
        }, 100);
    }
}

function showResults(isCorrect, selectedIndex, questionData) {
    const resultDiv = document.createElement('div');
    resultDiv.className = `result-message ${isCorrect ? 'correct' : 'incorrect'}`;
    
    if (isCorrect) {
        resultDiv.innerHTML = `
            <div>🎉 Correct! Well done!</div>
            <div class="explanation">
                <strong>Explanation:</strong> ${questionData.explanation}
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div>❌ Incorrect. The correct answer was: "${questionData.options[questionData.correct]}"</div>
            <div class="explanation">
                <strong>Explanation:</strong> ${questionData.explanation}
            </div>
        `;
    }
    
    // Highlight correct and incorrect options
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        if (index === questionData.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    // Insert result message
    const questionContent = document.querySelector('.question-content');
    const answerOptions = document.querySelector('.answer-options');
    questionContent.insertBefore(resultDiv, answerOptions.nextSibling);
}

function loadQuestion(priority) {
    const questionData = getRandomQuestion(priority);
    window.currentQuestion = questionData;
    
    // Set question text
    document.getElementById('questionText').textContent = questionData.question;
    
    // Create answer options
    const optionsContainer = document.getElementById('answerOptions');
    optionsContainer.innerHTML = '';
    
    questionData.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.innerHTML = `
            <input type="radio" id="option${index}" name="answer" value="${index}">
            <label for="option${index}">${option}</label>
        `;
        optionsContainer.appendChild(optionDiv);
    });
}

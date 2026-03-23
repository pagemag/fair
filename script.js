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

function initializeQuestionPage(duration, priority) {
    const timerElement = document.getElementById('timer');
    const submitBtn = document.getElementById('submitBtn');
    const answerTextarea = document.getElementById('answer');
    
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
            timerElement.textContent = "Time's Up!";
            timerElement.className = 'timer warning';
            answerTextarea.disabled = true;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Time Expired';
            
            // Show time up message
            const timeUpDiv = document.createElement('div');
            timeUpDiv.className = 'time-up';
            timeUpDiv.textContent = '⏰ Time has expired! Your answer has been automatically saved.';
            document.querySelector('.question-content').insertBefore(timeUpDiv, document.querySelector('.answer-area'));
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
        timer.stop();
        
        const answer = answerTextarea.value.trim();
        if (answer) {
            alert(`Ticket ${priority} submitted successfully!

Your answer: ${answer}`);
        } else {
            alert('Please provide an answer before submitting.');
            return;
        }
        
        // Redirect back to main page
        window.location.href = 'index.html';
    });
}

// Sample questions for each priority level
const questions = {
    p1: [
        "CRITICAL: The main database server is down and users cannot access the application. Customers are reporting complete service outage. What immediate steps would you take to restore service?",
        "SECURITY BREACH: Unauthorized access detected in the admin panel. Multiple user accounts may be compromised. What is your immediate response plan?",
        "CRITICAL: Payment processing system is failing. No transactions can be completed. How would you handle this emergency?"
    ],
    p2: [
        "HIGH PRIORITY: The website is loading very slowly (30+ seconds) and customers are complaining. Performance has degraded significantly since yesterday. What would you investigate first?",
        "MAJOR BUG: Users are unable to upload files larger than 1MB, but the system should support up to 10MB. This is affecting 60% of our users. How would you approach this?",
        "HIGH PRIORITY: Email notifications are not being sent to customers for order confirmations. This started 2 hours ago. What steps would you take?"
    ],
    p3: [
        "MEDIUM PRIORITY: Some users report that the search function occasionally returns irrelevant results. How would you investigate and resolve this issue?",
        "FEATURE REQUEST: Multiple customers have requested a dark mode option for the application. How would you approach implementing this feature?",
        "MEDIUM PRIORITY: The mobile app crashes on certain Android devices when accessing the profile page. How would you debug this issue?"
    ],
    p4: [
        "LOW PRIORITY: Users would like better tooltips and help text throughout the application. How would you improve the user experience?",
        "DOCUMENTATION: The API documentation is outdated and missing several new endpoints. How would you organize updating this?",
        "MINOR IMPROVEMENT: The loading animations could be more modern and engaging. What approach would you take to enhance them?"
    ]
};

function getRandomQuestion(priority) {
    const priorityQuestions = questions[priority];
    return priorityQuestions[Math.floor(Math.random() * priorityQuestions.length)];
}

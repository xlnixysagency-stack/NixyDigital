// 🔒 LIMITS MANAGER - Free Plan Restrictions
// This file manages all usage limits for free users

export const FREE_LIMITS = {
    studyMaterials: 3,      // Max 3 notes
    quizzesPerMonth: 5,     // Max 5 quizzes per month
    aiWritingsPerDay: 1,    // Max 1 AI writing per day
    questionsPerMaterial: 5 // Max 5 questions per material (not unlimited)
};

export const PLAN_NAMES = {
    free: 'Free',
    starter: 'Starter', // $10/month - coming soon
    pro: 'Pro'         // $20/month - coming soon
};

// Check if user can perform action
export async function canUserPerformAction(db, userId, action) {
    const userPlan = await getUserPlan(userId); // For now, everyone is free
    
    if (userPlan !== 'free') {
        return { allowed: true }; // Paid users have no limits
    }

    // Free plan checks
    switch (action) {
        case 'upload_material':
            return await checkMaterialLimit(db, userId);
        
        case 'take_quiz':
            return await checkQuizLimit(db, userId);
        
        case 'ai_writing':
            return await checkWritingLimit(db, userId);
        
        case 'generate_questions':
            return { allowed: true }; // Still allowed but limited to 5 questions
        
        default:
            return { allowed: true };
    }
}

// Get user's current plan (for now always free, later check Stripe)
async function getUserPlan(userId) {
    // TODO: When Stripe is set up, check subscription status
    return 'free';
}

// Check study materials limit
async function checkMaterialLimit(db, userId) {
    const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
    const materialsRef = collection(db, 'study_materials');
    const q = query(materialsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const count = snapshot.size;
    const limit = FREE_LIMITS.studyMaterials;
    
    if (count >= limit) {
        return {
            allowed: false,
            reason: `You've reached the free plan limit of ${limit} study materials.`,
            current: count,
            limit: limit,
            upgradeMessage: 'Upgrade to Starter ($10/month) for 20 materials or Pro ($20/month) for unlimited!'
        };
    }
    
    return {
        allowed: true,
        current: count,
        limit: limit,
        remaining: limit - count
    };
}

// Check quiz limit (5 per month)
async function checkQuizLimit(db, userId) {
    const { collection, query, where, getDocs, Timestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
    // Get start of current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStartTimestamp = Timestamp.fromDate(monthStart);
    
    const resultsRef = collection(db, 'quiz_results');
    const q = query(
        resultsRef,
        where('userId', '==', userId),
        where('completedAt', '>=', monthStartTimestamp)
    );
    const snapshot = await getDocs(q);
    
    const count = snapshot.size;
    const limit = FREE_LIMITS.quizzesPerMonth;
    
    if (count >= limit) {
        return {
            allowed: false,
            reason: `You've taken ${limit} quizzes this month (free plan limit).`,
            current: count,
            limit: limit,
            upgradeMessage: 'Upgrade to Starter or Pro for unlimited quizzes!'
        };
    }
    
    return {
        allowed: true,
        current: count,
        limit: limit,
        remaining: limit - count
    };
}

// Check AI writing limit (1 per day)
async function checkWritingLimit(db, userId) {
    const { collection, query, where, getDocs, Timestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
    // Get start of today
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayStartTimestamp = Timestamp.fromDate(todayStart);
    
    const writingsRef = collection(db, 'ai_writings');
    const q = query(
        writingsRef,
        where('userId', '==', userId),
        where('createdAt', '>=', todayStartTimestamp)
    );
    const snapshot = await getDocs(q);
    
    const count = snapshot.size;
    const limit = FREE_LIMITS.aiWritingsPerDay;
    
    if (count >= limit) {
        return {
            allowed: false,
            reason: `You've used your ${limit} AI writing for today (free plan limit).`,
            current: count,
            limit: limit,
            upgradeMessage: 'Upgrade to Starter for 10 writings/day or Pro for unlimited!'
        };
    }
    
    return {
        allowed: true,
        current: count,
        limit: limit,
        remaining: limit - count
    };
}

// Get usage stats for dashboard
export async function getUserUsageStats(db, userId) {
    const materialCheck = await checkMaterialLimit(db, userId);
    const quizCheck = await checkQuizLimit(db, userId);
    const writingCheck = await checkWritingLimit(db, userId);
    
    return {
        materials: {
            used: materialCheck.current,
            limit: materialCheck.limit,
            remaining: materialCheck.allowed ? materialCheck.remaining : 0
        },
        quizzes: {
            used: quizCheck.current,
            limit: quizCheck.limit,
            remaining: quizCheck.allowed ? quizCheck.remaining : 0
        },
        writings: {
            used: writingCheck.current,
            limit: writingCheck.limit,
            remaining: writingCheck.allowed ? writingCheck.remaining : 0
        }
    };
}
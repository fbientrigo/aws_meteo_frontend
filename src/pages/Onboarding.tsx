import { useNavigate } from 'react-router-dom';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useAuth } from '@/hooks/useAuth';

const Onboarding = () => {
    const navigate = useNavigate();
    const { updateProfile } = useAuth();

    const handleComplete = () => {
        console.log('Completing onboarding...');

        // Update profile and navigate
        updateProfile({
            onboarding: {
                completed: true,
                currentStep: 4,
                completedSteps: ['welcome', 'profile', 'features', 'setup'],
                skipped: false,
            },
        }).then(() => {
            console.log('Profile updated, navigating to dashboard...');
            navigate('/dashboard', { replace: true });
        }).catch((err) => {
            console.error('Error updating profile:', err);
            // Navigate anyway
            navigate('/dashboard', { replace: true });
        });
    };

    const handleSkip = () => {
        console.log('Skipping onboarding...');

        updateProfile({
            onboarding: {
                completed: true,
                currentStep: 0,
                completedSteps: [],
                skipped: true,
            },
        }).then(() => {
            console.log('Profile updated, navigating to dashboard...');
            navigate('/dashboard', { replace: true });
        }).catch((err) => {
            console.error('Error updating profile:', err);
            navigate('/dashboard', { replace: true });
        });
    };

    return (
        <OnboardingFlow
            onComplete={handleComplete}
            onSkip={handleSkip}
        />
    );
};

export default Onboarding;

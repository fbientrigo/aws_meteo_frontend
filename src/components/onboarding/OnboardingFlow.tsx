import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingStep1 } from './steps/OnboardingStep1';
import { OnboardingStep2 } from './steps/OnboardingStep2';
import { OnboardingStep3 } from './steps/OnboardingStep3';
import { OnboardingStep4 } from './steps/OnboardingStep4';

interface OnboardingFlowProps {
    onComplete: () => void;
    onSkip: () => void;
}

const steps = [
    {
        id: 'welcome',
        title: 'Welcome to AgriVibe',
        description: 'Your intelligent agricultural management platform',
        component: OnboardingStep1,
    },
    {
        id: 'profile',
        title: 'Complete Your Profile',
        description: 'Tell us about yourself and your farm',
        component: OnboardingStep2,
    },
    {
        id: 'features',
        title: 'Explore Key Features',
        description: 'Discover what you can do with AgriVibe',
        component: OnboardingStep3,
    },
    {
        id: 'setup',
        title: 'Quick Setup',
        description: 'Configure your preferences',
        component: OnboardingStep4,
    },
];

export const OnboardingFlow = ({ onComplete, onSkip }: OnboardingFlowProps) => {
    const { profile, updateProfile } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const hasInitialized = useRef(false);

    // Initialize step from profile only once
    useEffect(() => {
        if (!hasInitialized.current && profile?.onboarding.currentStep !== undefined) {
            // Ensure step is within bounds
            const validStep = Math.min(profile.onboarding.currentStep, steps.length - 1);
            setCurrentStep(validStep);
            hasInitialized.current = true;
        }
    }, [profile?.onboarding.currentStep]);

    const progress = ((currentStep + 1) / steps.length) * 100;

    // Ensure currentStep is within bounds
    const safeCurrentStep = Math.min(Math.max(0, currentStep), steps.length - 1);
    const CurrentStepComponent = steps[safeCurrentStep]?.component || steps[0].component;

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setDirection(1);
            const newStep = currentStep + 1;
            setCurrentStep(newStep);

            // Update profile in background (non-blocking)
            updateProfile({
                onboarding: {
                    ...profile!.onboarding,
                    currentStep: newStep,
                    completedSteps: [...profile!.onboarding.completedSteps, steps[currentStep].id],
                },
            }).catch(err => console.error('Failed to update profile:', err));
        } else {
            await handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        // Profile update is handled by parent component
        onComplete();
    };

    const handleSkip = async () => {
        await updateProfile({
            onboarding: {
                ...profile!.onboarding,
                skipped: true,
                completed: true,
            },
        });
        onSkip();
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-background via-background to-primary/5">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">AgriVibe Setup</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSkip}
                    className="rounded-full h-7 w-7"
                >
                    <X className="h-3.5 w-3.5" />
                </Button>
            </div>

            {/* Progress Bar */}
            <div className="absolute top-14 left-0 right-0 px-4">
                <div className="max-w-2xl mx-auto">
                    <Progress value={progress} className="h-1" />
                    <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                        <span>Step {currentStep + 1} of {steps.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="h-full flex items-start justify-center px-4 pt-24 pb-20 overflow-y-auto">
                <div className="w-full max-w-2xl my-auto">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.15 },
                            }}
                        >
                            <div className="bg-card border rounded-xl shadow-2xl p-4">
                                <div className="mb-4">
                                    <h2 className="text-lg font-bold mb-1.5 text-center">{steps[safeCurrentStep].title}</h2>
                                    <p className="text-muted-foreground text-xs text-center">{steps[safeCurrentStep].description}</p>
                                </div>

                                <CurrentStepComponent />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation */}
            <div className="absolute bottom-0 left-0 right-0 py-4 px-4 bg-gradient-to-t from-background via-background/95 to-transparent">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>

                    <div className="flex gap-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all ${index === currentStep
                                    ? 'w-8 bg-primary'
                                    : index < currentStep
                                        ? 'w-2 bg-primary/50'
                                        : 'w-2 bg-muted'
                                    }`}
                            />
                        ))}
                    </div>

                    <Button onClick={handleNext} className="gap-2">
                        {currentStep === steps.length - 1 ? (
                            <>
                                Complete
                                <Check className="h-4 w-4" />
                            </>
                        ) : (
                            <>
                                Next
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

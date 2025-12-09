import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { useRunSteps } from '@/hooks/useSTIData';

/**
 * Time Slider Component
 * Controls for navigating through forecast steps with animation
 */
export const TimeSlider = () => {
    const { selectedRun, selectedStep, setSelectedStep } = useAppStore();
    const { data: steps } = useRunSteps(selectedRun);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Sync internal index with global state
    useEffect(() => {
        if (steps && selectedStep) {
            const index = steps.indexOf(selectedStep);
            if (index !== -1) {
                setCurrentIndex(index);
            }
        }
    }, [selectedStep, steps]);

    // Handle animation
    useEffect(() => {
        if (isPlaying && steps) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => {
                    const next = prev + 1;
                    if (next >= steps.length) {
                        setIsPlaying(false);
                        return prev;
                    }
                    setSelectedStep(steps[next]);
                    return next;
                });
            }, 1500); // 1.5 seconds per step
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, steps, setSelectedStep]);

    if (!steps || steps.length === 0) return null;

    const handleSliderChange = (value: number[]) => {
        const index = value[0];
        setCurrentIndex(index);
        setSelectedStep(steps[index]);
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const stepBack = () => {
        const newIndex = Math.max(0, currentIndex - 1);
        setCurrentIndex(newIndex);
        setSelectedStep(steps[newIndex]);
    };

    const stepForward = () => {
        const newIndex = Math.min(steps.length - 1, currentIndex + 1);
        setCurrentIndex(newIndex);
        setSelectedStep(steps[newIndex]);
    };

    return (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md px-4 pointer-events-none">
            <Card className="bg-background/95 backdrop-blur-sm shadow-lg border-border p-3 pointer-events-auto">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                            Pronóstico: <span className="text-primary">+{steps[currentIndex]}h</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {currentIndex + 1} / {steps.length}
                        </div>
                    </div>

                    <Slider
                        value={[currentIndex]}
                        min={0}
                        max={steps.length - 1}
                        step={1}
                        onValueChange={handleSliderChange}
                        className="cursor-pointer"
                    />

                    <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={stepBack} disabled={currentIndex === 0} className="h-8 w-8">
                            <SkipBack className="w-4 h-4" />
                        </Button>

                        <Button
                            variant={isPlaying ? "secondary" : "default"}
                            size="icon"
                            onClick={togglePlay}
                            className="h-8 w-8 rounded-full"
                        >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </Button>

                        <Button variant="ghost" size="icon" onClick={stepForward} disabled={currentIndex === steps.length - 1} className="h-8 w-8">
                            <SkipForward className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TimeSlider;

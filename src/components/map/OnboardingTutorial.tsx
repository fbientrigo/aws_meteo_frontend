import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface OnboardingTutorialProps {
  shouldShow: boolean;
  onComplete: () => void;
}

const OnboardingTutorial = ({ shouldShow, onComplete }: OnboardingTutorialProps) => {
  useEffect(() => {
    if (!shouldShow) return;

    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: [
        {
          element: '#welcome-step',
          popover: {
            title: 'Welcome to SbNAI! 🌱',
            description: 'We will guide you step by step so you can analyze risks on your agricultural plots.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '#search-bar',
          popover: {
            title: 'Search your location 🔍',
            description: 'Use this bar to search for your plot by address, coordinates, or place name.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#layer-control',
          popover: {
            title: 'Activate risk layers 🗺️',
            description: 'Here you can activate or deactivate different risk layers (drought, flooding, etc.) and change the base map.',
            side: 'left',
            align: 'start'
          }
        },
        {
          element: '#drawing-toolbar',
          popover: {
            title: 'Draw your plot 📐',
            description: 'Use these tools to draw your plot area on the map. You can create custom polygons or rectangles.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '#dashboard-metrics',
          popover: {
            title: 'View automatic analysis 📊',
            description: 'Once you draw your plot, the system will automatically calculate risks, crops at risk, and potential savings.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          popover: {
            title: 'All set! ✨',
            description: 'Now you can explore the platform, draw your plots and get personalized recommendations. Good luck!',
            side: 'bottom',
            align: 'center'
          }
        }
      ],
      onDestroyStarted: () => {
        onComplete();
        driverObj.destroy();
      }
    });

    driverObj.drive();

    return () => {
      driverObj.destroy();
    };
  }, [shouldShow, onComplete]);

  return null;
};

export default OnboardingTutorial;
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="container mx-auto px-6">
        {title && (
          <div className="mb-8 animate-slide-down">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-400 text-lg">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

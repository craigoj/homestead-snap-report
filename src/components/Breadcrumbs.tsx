import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateBreadcrumbStructuredData, type BreadcrumbItem } from '@/lib/sitemap';
import { StructuredData } from './StructuredData';

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from current path if items not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location.pathname);
  
  if (breadcrumbItems.length <= 1) return null;
  
  return (
    <>
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-2 text-sm text-muted-foreground", className)}>
        <ol className="flex items-center space-x-2">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index === 0 && (
                <Home className="w-4 h-4 mr-1" aria-hidden="true" />
              )}
              
              {index < breadcrumbItems.length - 1 ? (
                <>
                  <Link
                    to={item.url}
                    className="hover:text-foreground transition-colors duration-200"
                    aria-label={`Navigate to ${item.name}`}
                  >
                    {item.name}
                  </Link>
                  <ChevronRight className="w-4 h-4 mx-2" aria-hidden="true" />
                </>
              ) : (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

// Helper function to generate breadcrumbs from pathname
const generateBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: '/' }
  ];
  
  // Route name mappings for better UX
  const routeNames: Record<string, string> = {
    dashboard: 'Dashboard',
    properties: 'Properties',
    assets: 'Assets',
    reports: 'Reports',
    auth: 'Sign In',
    add: 'Add New',
    edit: 'Edit',
    'bulk-operations': 'Bulk Operations'
  };
  
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip IDs and generic segments for cleaner breadcrumbs
    if (segment.match(/^[a-f0-9-]{36}$/)) return; // Skip UUIDs
    if (segment === 'add' && index > 0) return; // Skip 'add' in middle of path
    
    const name = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({
      name,
      url: currentPath
    });
  });
  
  return breadcrumbs;
};

export default Breadcrumbs;
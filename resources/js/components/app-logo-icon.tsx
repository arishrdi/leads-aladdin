import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
    return (
        <img 
            {...props} 
            src="/logo.png" 
            alt="Leads Aladdin Logo" 
            className={`object-contain ${props.className || ''}`}
        />
    );
}

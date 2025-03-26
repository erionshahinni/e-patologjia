// components/Dashboard/utils.js
export const getStatusColor = (report) => {
    if (!report) return 'bg-slate-100 text-slate-600';
    
    const status = report.status.toLowerCase();
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'controlled':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };
  
  export const getGenderIcon = (gender, className = "") => {
    return (
      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${getRandomColor(gender)} ${className}`}>
        {gender?.toLowerCase() === 'female' ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-6 h-6"
          >
            <path 
              fillRule="evenodd" 
              d="M12 1.5a5.25 5.25 0 00-5.25 5.25c0 .963.258 1.867.712 2.645l-.007-.006C6.584 10.258 6 11.56 6 13v1a1 1 0 001 1h.5a.5.5 0 01.5.5V17h8v-1.5a.5.5 0 01.5-.5h.5a1 1 0 001-1v-1c0-1.44-.584-2.742-1.455-3.611l-.007.006a5.209 5.209 0 00.712-2.645A5.25 5.25 0 0012 1.5zM15 8.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" 
              clipRule="evenodd" 
            />
          </svg>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-6 h-6"
          >
            <path 
              fillRule="evenodd" 
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
      </div>
    );
  };
  
  export const getRandomColor = (identifier) => {
    const colors = {
      female: 'bg-pink-500',
      male: 'bg-blue-500',
      default: [
        'bg-purple-500',
        'bg-indigo-500',
        'bg-teal-500',
        'bg-emerald-500'
      ]
    };
  
    if (identifier?.toLowerCase() === 'female') return colors.female;
    if (identifier?.toLowerCase() === 'male') return colors.male;
    
    const index = identifier ? identifier.charCodeAt(0) % colors.default.length : 0;
    return colors.default[index];
  };
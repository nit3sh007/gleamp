// import React from 'react';
// import { Search, Globe, X } from 'lucide-react';

// const SearchHeader = ({
//   searchQuery,
//   setSearchQuery,
//   selectedCategory,
//   setSelectedCategory,
//   openCountryFilter,
//   categories = ['All', 'Politics', 'Business', 'Technology', 'Sports', 'Entertainment']
// }) => {
//   return (
//     <div className="sticky top-0 bg-black border-b border-gray-800 z-10 pt-3 sm:pt-4 pb-2">
//       <div className="flex justify-between items-center px-4 sm:px-6 w-full max-w-xl mx-auto">
//         {/* Search container */}
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//           <input
//             type="text"
//             placeholder="Search news..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-8 py-2 sm:py-2.5 text-sm rounded-lg border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             aria-label="Search news"
//           />
//           {searchQuery && (
//             <button
//               onClick={() => setSearchQuery('')}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
//             >
//               <X className="w-4 h-4 sm:w-5 sm:h-5" />
//             </button>
//           )}
//         </div>
        
//         {/* Compact country selector - positioned next to search */}
//         <button 
//           onClick={openCountryFilter}
//           className="ml-2 p-1.5 sm:p-2 rounded-full hover:bg-gray-800 h-10 w-10 flex items-center justify-center flex-shrink-0"
//         >
//           <Globe className="w-5 h-5 text-gray-400" />
//         </button>
//       </div>

//       {/* Categories scrollable row */}
//       <div className="mt-4 sm:mt-5 pb-2 overflow-x-auto no-scrollbar">
//         <div className="flex space-x-2 px-4 w-full max-w-xl mx-auto">
//           {categories.map(category => (
//             <button
//               key={category}
//               onClick={() => setSelectedCategory(category)}
//               className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
//                 selectedCategory === category
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//               }`}
//             >
//               {category}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchHeader;


import React from 'react';
import { Search, Globe, X } from 'lucide-react';

const SearchHeader = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  openCountryFilter,
  categories = ['All', 'Politics', 'Business', 'Technology', 'Sports', 'Entertainment']
}) => {
  return (
    <div className="sticky top-0 bg-black border-b border-gray-800 z-10 pt-3 sm:pt-4 pb-2">
      <div className="flex justify-between items-center px-4 sm:px-6 w-full max-w-xl mx-auto">
        {/* Search container */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 sm:py-2.5 text-sm rounded-lg border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search news"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
        
        {/* Compact country selector - positioned next to search */}
        <button 
          onClick={openCountryFilter}
          className="ml-2 p-1.5 sm:p-2 rounded-full hover:bg-gray-800 h-10 w-10 flex items-center justify-center flex-shrink-0"
        >
          <Globe className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Categories scrollable row */}
      <div className="mt-4 sm:mt-5 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex space-x-2 px-4 w-full max-w-xl mx-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
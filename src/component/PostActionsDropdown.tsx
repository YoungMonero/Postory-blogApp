import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, Download, Eye, EyeOff } from 'lucide-react';

interface PostActionsDropdownProps {
  postId: string;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility?: () => void;
  onDownload?: () => void;
  currentStatus?: 'published' | 'draft';
}

export default function PostActionsDropdown({
  postId,
  isOwner,
  onEdit,
  onDelete,
  onToggleVisibility,
  onDownload,
  currentStatus = 'published'
}: PostActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Only show dropdown if user is the owner
  if (!isOwner) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Three-dot button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Post options"
      >
        <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-50 py-1">
          {/* Edit Option */}
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Edit className="w-4 h-4 mr-3" />
            Edit Post
          </button>

          {/* Toggle Visibility (Draft/Published) */}
          {onToggleVisibility && (
            <button
              onClick={() => {
                onToggleVisibility();
                setIsOpen(false);
              }}
              className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {currentStatus === 'published' ? (
                <>
                  <EyeOff className="w-4 h-4 mr-3" />
                  Move to Draft
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-3" />
                  Publish Now
                </>
              )}
            </button>
          )}

          {/* Download Option */}
          {onDownload && (
            <button
              onClick={() => {
                onDownload();
                setIsOpen(false);
              }}
              className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Download className="w-4 h-4 mr-3" />
              Download Post
            </button>
          )}

          {/* Delete Option (with warning style) */}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this post?')) {
                onDelete();
              }
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-3" />
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
}
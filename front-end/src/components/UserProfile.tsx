
import { User as UserReactModel, Award } from 'lucide-react';
import { UserModel } from './Models';

interface UserProfileProps {
  user: UserModel;
}

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-amber-200">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-amber-300 shadow-lg">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f59e0b&color=fff&size=64`;
              }}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}'s</h1>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <h2 className="text-xl text-amber-700 font-semibold">Game Collection</h2>
          <p className="text-sm text-gray-600 mt-1">Steam ID: {user.id}</p>
        </div>

        {/* Collection Badge */}
        <div className="hidden sm:block">
          <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-2 rounded-full shadow-md">
            <div className="flex items-center space-x-2">
              <UserReactModel className="w-4 h-4" />
              <span className="font-semibold text-sm">Collector</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

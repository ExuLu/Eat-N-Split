import { useState } from 'react';
import { initialFriends } from './data';

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className='button'>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList />
        {showAddFriend && <FormAddFriend />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>
      <FormSplitBill />
    </div>
  );
}

function FriendsList() {
  const friends = initialFriends;

  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} />
      ))}
    </ul>
  );
}

function Friend({ friend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owes you {friend.balance}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button>Select</Button>
    </li>
  );
}

function FormAddFriend() {
  const [name, setName] = useState('');
  const [img, setImg] = useState('');

  function handleAddFriend() {}

  return (
    <form className='form-add-friend'>
      <label>👫 Friend name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type='text'
      />

      <label>🌠 Image URL</label>
      <input value={img} onChange={(e) => setImg(e.target.value)} type='text' />

      <Button onClick={handleAddFriend}>Add</Button>
    </form>
  );
}

function FormSplitBill() {
  return (
    <form className='form-split-bill'>
      <h2>Split a bill with X</h2>

      <label>💸 Bill value</label>
      <input type='text' />

      <label>🧍 Your expense</label>
      <input type='text' />

      <label>👫 X's expense</label>
      <input type='text' disabled />

      <label>🤑 Who is paying the bill?</label>
      <select>
        <option value={'user'}>You</option>
        <option value={'friend'}>X</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

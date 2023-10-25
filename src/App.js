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
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList
          onSelect={handleSelection}
          friends={friends}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill friend={selectedFriend} onSplitBill={handleSplitBill} />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelect, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          onSelect={onSelect}
          friend={friend}
          selectedFriend={selectedFriend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selectedFriend }) {
  const selected = friend.id === selectedFriend?.id;

  return (
    <li className={selected ? 'selected' : ''}>
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
      <Button onClick={() => onSelect(friend)}>
        {selected ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSumbitForm(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = { id, name, image: `${image}?=${id}`, balance: 0 };

    onAddFriend(newFriend);

    setName('');
    setImage('https://i.pravatar.cc/48');
  }

  return (
    <form className='form-add-friend' onSubmit={handleSumbitForm}>
      <label>👫 Friend name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type='text'
      />

      <label>🌠 Image URL</label>
      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        type='text'
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [payedByUser, setPayedByUser] = useState('');
  const [whoIsPaying, setWhoIsPaying] = useState('user');
  const payedByFriend = bill ? bill - payedByUser : '';

  function handleSubmitSplit(e) {
    e.preventDefault();

    if (!bill || !payedByFriend) return;

    onSplitBill(whoIsPaying === 'user' ? payedByFriend : -payedByUser);
  }

  return (
    <form className='form-split-bill' onSubmit={handleSubmitSplit}>
      <h2>Split a bill with {friend.name}</h2>

      <label>💸 Bill value</label>
      <input
        type='text'
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍 Your expense</label>
      <input
        type='text'
        value={payedByUser}
        onChange={(e) =>
          setPayedByUser(
            Number(e.target.value) > bill ? payedByUser : Number(e.target.value)
          )
        }
      />

      <label>👫 {friend.name}'s expense</label>
      <input type='text' disabled value={payedByFriend} />

      <label>🤑 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value={'user'}>You</option>
        <option value={'friend'}>{friend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

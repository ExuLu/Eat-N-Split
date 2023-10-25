import { useState } from 'react';
import Button from './Button';

export default function FormSplitBill({ friend, onSplitBill }) {
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

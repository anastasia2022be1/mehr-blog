import React from 'react'
import PostAuthor from '../components/PostAuthor.jsx'
import { Link } from 'react-router-dom'
import Travel1 from "../images/Travel1.jpg"

const PostDetail = () => {
  return (
    <section className="post-detail">
      <div className="container post-detail__container">
        <div className="post-detail__header">
          <PostAuthor />
          <div className="post-detail__btns">
            <Link to={`/posts/werwer/edit`} className='btn sm primary'>Edit</Link>
            <Link to={`/posts/werwer/delete`} className='btn sm danger'>Delete</Link>
          </div>
        </div>

        <h1>This is the post title</h1>
        <div className="post-detail__thumbnail">
          <img src={Travel1} alt="" />
        </div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia repellat enim sequi architecto praesentium id excepturi quasi quibusdam, libero maxime sapiente ex tenetur, hic quas. Dolor voluptate obcaecati quod impedit blanditiis ipsam. Ipsam repellat veniam, assumenda minus aspernatur asperiores cumque?</p>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa possimus autem veniam soluta non accusamus fugit dolore ipsum animi obcaecati modi quaerat quas, voluptates a cumque blanditiis eius sapiente nisi. Assumenda deserunt culpa suscipit sit? Commodi quas explicabo minus dignissimos cum necessitatibus, facere, aut distinctio corrupti ut dolorum architecto laudantium eaque nam debitis blanditiis ad.</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus, quis! Magni exercitationem quas ipsa ratione asperiores! Tenetur veniam voluptatem enim, nobis vitae quo rem beatae harum provident optio neque culpa sed, asperiores aperiam consequatur. Aspernatur minima iure maiores delectus illum id iste rerum labore animi perferendis unde facilis facere quasi architecto minus ut recusandae dolores doloribus, eos mollitia ea consequuntur impedit aut? Odio minima eaque debitis obcaecati accusantium praesentium libero fugit, officia, velit at numquam similique culpa. Veritatis praesentium, ab dolores aperiam accusantium commodi culpa dolore. Commodi autem nihil qui, temporibus fuga aut. Dolorem debitis impedit quos earum quod molestias!</p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus veritatis, tempore quaerat quae impedit expedita adipisci, ab suscipit ipsa ea omnis nemo, aperiam laboriosam? Odit voluptatibus quia saepe, autem repudiandae incidunt quaerat voluptates, natus laboriosam dolor corporis blanditiis minima perspiciatis soluta similique ullam sint eos magni, non itaque voluptate? Nostrum quis odio dolores sapiente possimus minima molestias et consectetur, laborum doloremque iure voluptatem quibusdam maiores vitae nihil in magnam unde error! Necessitatibus, harum. Magni sed ab cumque dolorem necessitatibus, alias dolorum animi, perferendis velit ex quia deleniti debitis earum! Amet voluptatibus deserunt perspiciatis vero veniam officia, qui quia eaque dolore, doloribus hic tenetur! Rem, ipsa. Blanditiis voluptates culpa assumenda. Maiores, non. Dignissimos recusandae est adipisci molestiae culpa obcaecati totam minus quibusdam rem vitae similique optio, quas fugiat pariatur possimus dolore dicta eos consequuntur commodi quisquam amet ipsa molestias deserunt? Corporis commodi iure libero. Alias, tempora officiis impedit id, iure quo enim recusandae consequuntur quasi libero labore! Cumque libero dolor maiores repellat iste harum numquam dolorem inventore voluptatum explicabo, molestiae porro perspiciatis delectus commodi repudiandae aspernatur beatae sed voluptas, aut voluptate. Totam porro odit nesciunt ad reprehenderit, maxime ratione architecto tempore eos est eius qui, magnam cupiditate odio unde debitis iusto.</p>
      </div>
   </section>
  )
}

export default PostDetail
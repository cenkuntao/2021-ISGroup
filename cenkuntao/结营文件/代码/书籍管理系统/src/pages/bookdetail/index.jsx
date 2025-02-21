import React, { useState, createElement } from 'react'
import {
    MessageFilled, LikeFilled, StarFilled,
} from '@ant-design/icons';
import { Image, Button, Avatar, Comment, Form, Input, List, Tooltip } from 'antd';
import moment from 'moment';
import './index.css'
import { DislikeFilled, DislikeOutlined, LikeOutlined } from '@ant-design/icons';
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios'
import star from './images/红星星.png'
import noStar from './images/没有收藏.png'
import good from './images/点赞了.png'
import noGood from './images/没有点赞.png'
import comment from './images/没有评论.png'

//发表评论
const { TextArea } = Input;
const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={(props) => <Comment {...props} />}
    />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </>
);

export default function Bookdetail() {

    const navigate = useNavigate()

    // 传过来书籍的数据 book.index是书籍索引
    const book1 = useLocation().state.book;
    console.log('book1',book1);
    // console.log(book1,'book1');
    // 从本地获取user_name
    let user_name = JSON.parse(localStorage.getItem('bookManagement')).user_name;

    // 设置状态存放传回来的书籍信息
    const [book2,setBook]=useState({
            index:1,
            title:'',
            cover:'',
            author:'',
            translator:'',
            publishHouse:'',
            publishTime:'',
            authorInfo:'',
            starCount:'',
            bookInfo:'',
            goodCount:'',
            readingCount:'',
            pointCount:'',
            tag:'',
    });
    const [msg,setMsg]=useState({
            praise:false,
            Count:false
    })

    React.useEffect(()=>{
        console.log(book1.bookIndex,'book1.bookIndex');
        //向远程服务器发送请求
        axios({
            method: 'GET',
            url: `https://5v686c5039.goho.co/user=${user_name}/book=${book1.bookIndex}/main`,
            }).then(
            response => {
                // for(let x in response.data.book.review){
                //     console.log(i,x,'hehe');
                // }
            response.data.book.review.length=100;
            // console.log(Array.from(response.data.book.review),'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
            setBook(response.data.book);
            setMsg(response.data.message)
            const data1=Array.from(response.data.book.review).map((x,i)=>{
                return({
                    author:x.user_name,
                    avatar:x.user_url
                })
            })
            setComments(data1)

            },
            error => {
                console.log(error);
            }
        )
        // 注意这里到时候是要用get请求发的
        // axios.post('http://localhost:8000/bookdetail',JSON.stringify({
        //     user_name:user_name,
        //     index:book1.index
        //   }))
        //   .then(
        //     (response)=>{
        //         setBook(response.data.message.book);
        //         setMsg(response.data.message.message)
        //         setComments()
        //         console.log(response);
        //         // console.log(msg);
        //     },
        //     (error)=>{
        //         console.log(error);
        //       })
    },[]);

    //发表评论
    const ExampleComment = ({ children }) => (
        <Comment
            actions={actions}
            author={<a>Han Solo</a>}
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
            content={
                <p>
                    We supply a series of design principles, practical patterns and high quality design
                    resources (Sketch and Axure).
                </p>
            }
            datetime={
                <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment().fromNow()}</span>
                </Tooltip>
            }
        >
            {children}
        </Comment>
    );
    // 发表评论
    const [comments, setComments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');
    const handleSubmit = () => {
        if (!value) return;
        setSubmitting(true);
        axios({
            method: 'POST',
            url: `https://5v686c5039.goho.co/user=${user_name}/book=${book1.bookIndex}/review`,
            }).then(res=>console.log(res))
        setTimeout(() => {
            setSubmitting(false);
            setValue('');
            setComments([
                ...comments,
                {
                    author: 'Han Solo',
                    avatar: 'https://joeschmoe.io/api/v1/random',
                    content: <p>{value}</p>,
                    datetime: moment().fromNow(),
                },
            ]);
        }, 1000);
    };

    const handleChange = (e) => {
        setValue(e.target.value);
    };
    //d
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [action, setAction] = useState(null);

    const like = () => {
        setLikes(1);
        setDislikes(0);
        setAction('liked');
    };

    const dislike = () => {
        setLikes(0);
        setDislikes(1);
        setAction('disliked');
    };

    const actions = [
        <Tooltip key="comment-basic-like" title="Like">
            <span onClick={like}>
                {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
                <span className="comment-action">{likes}</span>
            </span>
        </Tooltip>,
        <Tooltip key="comment-basic-dislike" title="Dislike">
            <span onClick={dislike}>
                {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined)}
                <span className="comment-action">{dislikes}</span>
            </span>
        </Tooltip>,
        <span key="comment-basic-reply-to">回复</span>,
    ];

    // 点赞
    function handleGood(Event){
        Event.target.style.src={good}
        //向远程服务器发送请求
        axios({
            method: 'GET',
            url: `https://5v686c5039.goho.co/user=${user_name}/book=${book1.bookIndex}/praise`,
            }).then(
            response => {
                console.log(response);
            },
            error => {
                console.log(error);
            }
        )
    }

    // 收藏
    function handleStar(Event){
        Event.target.style.src='./images/红星星.png'
        //向远程服务器发送请求
        axios({
            method: 'GET',
            url: `https://5v686c5039.goho.co/user=${user_name}/book=${book1.bookIndex}/star`,
            }).then(
            response => {
                console.log(response);
            },
            error => {
                console.log(error);
            }
        )
    }


    return (
        <div className='Bookdetail'>
            {/* 第一模块 */}
            <div className='Bookdetail-top'>
                <div className='Bookdetail-title'>{book2.title}</div>
                <div className='Bookdetail-authorname'>{book2.author}</div>
                {/* <MessageFilled style={{ color: '#773D31' }} className='Bookdetail-icon1' />
                <LikeFilled style={{ color: '#773D31' }} className='Bookdetail-icon2' />
                <StarFilled style={{ color: '#773D31' }} className='Bookdetail-icon3' /> */}
                <img src={comment} alt="" className='Bookdetail-icon1' />
                <img src={noGood} alt="" className='Bookdetail-icon2' onClick={(Event)=>handleGood(Event)}/>
                <img src={noStar} alt="" className='Bookdetail-icon3' onClick={(Event)=>handleStar(Event)}/>
            </div>
            {/* 第二模块 */}
            <div className='Bookdetail-card'>
                <Image
                    className='Bookdetail-pic'
                    width={120}
                    height={160}
                    src={book2.cover}
                    fallback="data:image/png;base64,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"
                />
                <ul className='Bookdetail-label'>
                    <li><strong>书名：</strong> {book2.title}</li>
                    <li><strong>作者：</strong> {book2.author}</li>
                    <li><strong>译者：</strong> {book2.translator}</li>
                    <li><strong>出版社：</strong> {book2.publishHouse}</li>
                    <li><strong>出版年份：</strong> {book2.publishTime}</li>
                    <li><strong>标签：</strong><div className='Bookdetail-tag'>{book2.tag}</div></li>
                </ul>
                <div className='Bookdetail-line'></div>
                <div className='Bookdetail-score'>{book2.point}</div>
                <div className='Bookdetail-scorepople'>共 <i style={{ color: 'brown' }}>{book2.pointCount}</i> 人点评</div>
                <ul className='Bookdetail-imf'>
                    <li>浏览量 <strong>{book2.readingCount}</strong> 次</li>
                    <li>点赞数 <strong>{book2.pointCount}</strong> 次</li>
                    <li>收藏数 <strong>{book2.starCount}</strong> 次</li>
                </ul>
                <div className='Bookdetail-desc'>{book2.bookInfo}</div>
            </div>
            {/* 第三模块 */}
            <div className='Bookdetail-author'>
                <Image
                    className='Bookdetail-authorpic'
                    width={100}
                    height={140}
                    src="https://img2.baidu.com/it/u=3411260391,2885172541&fm=253&fmt=auto&app=120&f=JPEG?w=640&h=1106"
                />
                <div className='Bookdetail-authordesc'>作者介绍</div>
                <div className='Bookdetail-authordesccontent'>{book2.authorInfo}</div>
            </div>
            {/* 第四模块 */}
            <div className='Bookdetail-comment'>
                <>
                    {comments.length > 0 && <CommentList comments={comments} />}
                    <Comment
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                        content={
                            <Editor
                                onChange={handleChange}
                                onSubmit={handleSubmit}
                                submitting={submitting}
                                value={value}
                            />
                        }
                    />
                </>
            </div>
        </div>
    )
}
